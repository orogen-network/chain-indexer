/**
 * pallet-operator-stake event handler.
 *
 * Maintains the `Operator` row through Registered / Heartbeat / Slashed.
 */
import type { Ctx, IndexerBlock, IndexerEvent } from '../types/context.js';
import { Operator } from '../model/index.js';
import {
    decode,
    type HeartbeatEvent,
    type OperatorSlashedEvent,
    type RegisteredEvent,
} from '../types/events.js';

export async function handleOperators(
    ctx: Ctx,
    block: IndexerBlock,
    event: IndexerEvent,
): Promise<void> {
    const [, name] = event.name.split('.');

    switch (name) {
        case 'Registered': {
            const p = decode<RegisteredEvent>(event.args);
            await ctx.store.upsert(
                new Operator({
                    id: p.operator,
                    registeredAt: block.header.height,
                    stake: p.stake,
                    attestationCid: p.attestationCid,
                    lastHeartbeat: null,
                    active: true,
                }),
            );
            return;
        }
        case 'Heartbeat': {
            const p = decode<HeartbeatEvent>(event.args);
            const existing = await ctx.store.get(Operator, p.operator);
            if (!existing) {
                // Defensive: heartbeat from an unknown operator should not
                // happen on a clean chain but is cheap to ignore.
                ctx.log.warn({ operator: p.operator }, 'operators: heartbeat from unknown id');
                return;
            }
            existing.lastHeartbeat = p.height;
            existing.active = true;
            await ctx.store.upsert(existing);
            return;
        }
        case 'Slashed': {
            const p = decode<OperatorSlashedEvent>(event.args);
            const existing = await ctx.store.get(Operator, p.operator);
            if (!existing) return;
            // Reduce stake; don't go below zero.
            existing.stake = existing.stake > p.amount ? existing.stake - p.amount : 0n;
            await ctx.store.upsert(existing);
            return;
        }
        default:
            ctx.log.debug({ event: event.name }, 'operators: unhandled');
    }
}
