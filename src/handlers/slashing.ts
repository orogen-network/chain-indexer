/**
 * pallet-slashing event handler.
 *
 * Tracks `SlashEvent` rows (open / confirmed) and `DisputeEvent` rows.
 * Operator entities are upserted lazily so the foreign-key target exists.
 */
import type { Ctx, IndexerBlock, IndexerEvent } from '../types/context.js';
import {
    Block,
    DisputeEvent,
    Operator,
    SlashEvent,
    SlashKind,
    SlashStatus,
} from '../model/index.js';
import {
    decode,
    type DisputeOpenedEvent,
    type SlashConfirmedEvent,
    type SlashOpenedEvent,
} from '../types/events.js';

export async function handleSlashing(
    ctx: Ctx,
    block: IndexerBlock,
    event: IndexerEvent,
): Promise<void> {
    const blockRef = new Block({ id: block.header.hash });
    const [, name] = event.name.split('.');

    switch (name) {
        case 'SlashOpened': {
            const p = decode<SlashOpenedEvent>(event.args);
            const operator = await ensureOperator(ctx, p.operator, block.header.height);
            const slashId = `${block.header.hash}-${event.index}`;
            await ctx.store.upsert(
                new SlashEvent({
                    id: slashId,
                    block: blockRef,
                    operator,
                    amount: p.amount,
                    kind: SlashKind[p.kind] ?? SlashKind.Other,
                    status: SlashStatus.Open,
                    reasonHash: p.reasonHash,
                    openedAt: block.header.height,
                    resolvedAt: null,
                }),
            );
            return;
        }
        case 'SlashConfirmed': {
            const p = decode<SlashConfirmedEvent>(event.args);
            // The original SlashEvent id is lost from chain context; in
            // practice we'd carry a `slashEventId` field. Until pallet-suite
            // exposes one, scan by operator + most-recent-open.
            const candidates = await ctx.store.find(SlashEvent, {
                where: { status: SlashStatus.Open },
                order: { openedAt: 'DESC' },
                take: 16,
            });
            const target = candidates.find(
                (s) => s.operator?.id === p.operator && s.amount === p.amount,
            );
            if (!target) {
                ctx.log.warn(
                    { operator: p.operator, amount: p.amount.toString() },
                    'slashing: confirm event has no matching open slash',
                );
                return;
            }
            target.status = SlashStatus.Confirmed;
            target.resolvedAt = p.resolvedAt;
            await ctx.store.upsert(target);
            return;
        }
        case 'DisputeOpened': {
            const p = decode<DisputeOpenedEvent>(event.args);
            const candidates = await ctx.store.find(SlashEvent, {
                where: { status: SlashStatus.Open },
                order: { openedAt: 'DESC' },
                take: 16,
            });
            const target = candidates.find((s) => s.operator?.id === p.operator);
            if (!target) return;
            target.status = SlashStatus.Disputed;
            await ctx.store.upsert(target);
            await ctx.store.upsert(
                new DisputeEvent({
                    id: `${block.header.hash}-${event.index}`,
                    block: blockRef,
                    slashEvent: target,
                    disputant: p.disputant,
                    evidenceCid: p.evidenceCid,
                    panelDecision: null,
                }),
            );
            return;
        }
        default:
            ctx.log.debug({ event: event.name }, 'slashing: unhandled');
    }
}

async function ensureOperator(
    ctx: Ctx,
    id: string,
    height: number,
): Promise<Operator> {
    const existing = await ctx.store.get(Operator, id);
    if (existing) return existing;
    const created = new Operator({
        id,
        registeredAt: height,
        stake: 0n,
        attestationCid: null,
        lastHeartbeat: null,
        active: true,
    });
    await ctx.store.upsert(created);
    return created;
}
