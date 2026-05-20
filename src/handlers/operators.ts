/**
 * pallet-operator-stake event handler.
 *
 * Maintains the `Operator` row through Registered / Unregistered /
 * Heartbeat / Slashed.
 */
import type { Ctx, IndexerBlock, IndexerEvent } from '../types/context.js';
import { Operator } from '../model/generated/index.js';
import {
    decodeEvent,
    type HeartbeatEvent,
    type OperatorSlashedEvent,
    type RegisteredEvent,
    type UnregisteredEvent,
} from '../types/events.js';

export async function handleOperators(
    ctx: Ctx,
    block: IndexerBlock,
    event: IndexerEvent,
): Promise<void> {
    const [, name] = event.name.split('.');

    switch (name) {
        case 'Registered': {
            const p = decodeEvent<RegisteredEvent>(event);
            await ctx.store.upsert(
                new Operator({
                    id: getOperatorId(p),
                    registeredAt: block.header.height,
                    stake: p.stake,
                    attestationCid: p.attestationCid ?? p.attestation_cid ?? null,
                    lastHeartbeat: null,
                    active: true,
                }),
            );
            return;
        }
        case 'Unregistered': {
            const p = decodeEvent<UnregisteredEvent>(event);
            const existing = await ctx.store.get(Operator, getOperatorId(p));
            if (!existing) return;
            existing.active = false;
            existing.stake = 0n;
            await ctx.store.upsert(existing);
            return;
        }
        case 'Heartbeat': {
            const p = decodeEvent<HeartbeatEvent>(event);
            const operator = getOperatorId(p);
            const existing = await ctx.store.get(Operator, operator);
            if (!existing) {
                // Defensive: heartbeat from an unknown operator should not
                // happen on a clean chain but is cheap to ignore.
                ctx.log.warn({ operator }, 'operators: heartbeat from unknown id');
                return;
            }
            existing.lastHeartbeat = toSafeInteger(p.height ?? p.epoch ?? block.header.height);
            existing.active = true;
            await ctx.store.upsert(existing);
            return;
        }
        case 'Slashed': {
            const p = decodeEvent<OperatorSlashedEvent>(event);
            const existing = await ctx.store.get(Operator, getOperatorId(p));
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

function getOperatorId(event: { operator?: string; who?: string }): string {
    return event.operator ?? event.who ?? '';
}

function toSafeInteger(value: number | bigint): number {
    const asNumber = typeof value === 'bigint' ? Number(value) : value;
    if (!Number.isSafeInteger(asNumber)) {
        throw new Error(`operator height/epoch is not a safe integer: ${value.toString()}`);
    }
    return asNumber;
}
