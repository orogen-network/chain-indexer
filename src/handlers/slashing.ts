/**
 * pallet-slashing event handler.
 *
 * Tracks `SlashEvent` rows and dispute/ratification lifecycle updates.
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
} from '../model/generated/index.js';
import {
    decodeEvent,
    type SlashDisputedEvent,
    type SlashFinalizedEvent,
    type SlashRatifiedEvent,
    type SlashSubmittedEvent,
} from '../types/events.js';

export async function handleSlashing(
    ctx: Ctx,
    block: IndexerBlock,
    event: IndexerEvent,
): Promise<void> {
    const blockRef = new Block({ id: block.header.hash });
    const [, name] = event.name.split('.');

    switch (name) {
        case 'SlashSubmitted': {
            const p = decodeEvent<SlashSubmittedEvent>(event);
            const slashId = slashEventId(p);
            const operator = await ensureOperator(ctx, p.operator, block.header.height);
            const faultCode = variantName(p.faultCode ?? p.fault_code);
            await ctx.store.upsert(
                new SlashEvent({
                    id: slashId,
                    block: blockRef,
                    operator,
                    amount: null,
                    kind: slashKind(ctx, faultCode),
                    faultCode: faultCode || null,
                    status: SlashStatus.Open,
                    reasonHash: null,
                    openedAt: block.header.height,
                    resolvedAt: null,
                }),
            );
            return;
        }
        case 'SlashDisputed': {
            const p = decodeEvent<SlashDisputedEvent>(event);
            const target = await findSlash(ctx, p);
            if (!target) {
                ctx.log.warn({ slashId: getSlashId(p) }, 'slashing: dispute has no matching slash');
                return;
            }
            target.status = SlashStatus.Disputed;
            await ctx.store.upsert(target);
            await ctx.store.upsert(
                new DisputeEvent({
                    id: `${block.header.hash}-${event.index}`,
                    block: blockRef,
                    slashEvent: target,
                    disputant: null,
                    evidenceCid: null,
                    panelDecision: null,
                }),
            );
            return;
        }
        case 'SlashRatified': {
            const p = decodeEvent<SlashRatifiedEvent>(event);
            const target = await findSlash(ctx, p);
            if (!target) {
                ctx.log.warn({ slashId: getSlashId(p) }, 'slashing: ratification has no matching slash');
                return;
            }
            target.status = isRatified(p.decision) ? SlashStatus.Confirmed : SlashStatus.Reversed;
            target.resolvedAt = block.header.height;
            await ctx.store.upsert(target);
            return;
        }
        case 'SlashFinalized': {
            const p = decodeEvent<SlashFinalizedEvent>(event);
            const target = await findSlash(ctx, p);
            if (!target) {
                ctx.log.warn({ slashId: getSlashId(p) }, 'slashing: finalization has no matching slash');
                return;
            }
            if (target.status === SlashStatus.Open) {
                target.status = SlashStatus.Confirmed;
            }
            target.resolvedAt = block.header.height;
            await ctx.store.upsert(target);
            return;
        }
        case 'SlashArbitrated':
            return;
        default:
            ctx.log.debug({ event: event.name }, 'slashing: unhandled');
    }
}

async function findSlash(
    ctx: Ctx,
    p: { slashId?: number | bigint; slash_id?: number | bigint },
): Promise<SlashEvent | undefined> {
    return ctx.store.get(SlashEvent, slashEventId(p));
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

function slashEventId(event: { slashId?: number | bigint; slash_id?: number | bigint }): string {
    return `slash-${getSlashId(event).toString()}`;
}

function getSlashId(event: { slashId?: number | bigint; slash_id?: number | bigint }): number | bigint {
    return event.slashId ?? event.slash_id ?? 0;
}

/**
 * Map a pallet-slashing `FaultCode` variant to the coarse `SlashKind` category.
 *
 * This is an EXHAUSTIVE switch over all 13 runtime FaultCode variants
 * (pallet-suite/pallets/slashing). The previous implementation used a dead
 * `code in SlashKind` branch (the variant names never match SlashKind keys)
 * plus fragile substring heuristics, which silently bucketed 10 of 13 variants
 * to `Other` and misclassified `ValidatorCollusion` as `DisputeUpheld`. The
 * exact variant is preserved on `SlashEvent.faultCode` so the precise reason
 * is never lost to the coarse enum. Unknown variants fall through to `Other`
 * with a warning so a new runtime FaultCode is not silently mis-bucketed.
 */
function slashKind(ctx: Ctx, faultCode: string): SlashKind {
    switch (faultCode) {
        case 'WrongResponse':
        case 'LogProbDrift':
        case 'CacheReplay':
            return SlashKind.ReceiptMismatch;
        case 'HeartbeatMiss':
            return SlashKind.MissedHeartbeat;
        case 'AttestationStale':
        case 'DeviceCertCollision':
            return SlashKind.AttestationRevoked;
        // WrongModel, QuantizationSwap, KernelPackMismatch, SanctionsHit,
        // ValidatorCollusion, FakeBurn, BatchOvercommit — no dedicated coarse
        // category. The precise variant is on SlashEvent.faultCode.
        case 'WrongModel':
        case 'QuantizationSwap':
        case 'KernelPackMismatch':
        case 'SanctionsHit':
        case 'ValidatorCollusion':
        case 'FakeBurn':
        case 'BatchOvercommit':
            return SlashKind.Other;
        default:
            ctx.log.warn({ faultCode }, 'slashing: unknown FaultCode variant; bucketing to Other');
            return SlashKind.Other;
    }
}

function isRatified(decision: unknown): boolean {
    const value = variantName(decision).toLowerCase();
    return value.includes('slash') || value.includes('uphold') || value.includes('ratif');
}

function variantName(value: unknown): string {
    if (value && typeof value === 'object' && '__kind' in value) {
        const kind = (value as { __kind?: unknown }).__kind;
        return typeof kind === 'string' ? kind : '';
    }
    return String(value ?? '');
}
