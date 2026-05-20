/**
 * pallet-bme event handler. Captures burn + mint events as immutable rows.
 */
import type { Ctx, IndexerBlock, IndexerEvent } from '../types/context.js';
import { Block, BurnEvent, MintEvent } from '../model/generated/index.js';
import { decodeEvent, type BurnSubmittedEvent, type MintedEvent } from '../types/events.js';

export async function handleBme(
    ctx: Ctx,
    block: IndexerBlock,
    event: IndexerEvent,
): Promise<void> {
    const blockRef = new Block({ id: block.header.hash });
    const [, name] = event.name.split('.');

    switch (name) {
        case 'BurnSubmitted': {
            const p = decodeEvent<BurnSubmittedEvent>(event);
            await ctx.store.upsert(
                new BurnEvent({
                    id: `${block.header.hash}-${event.index}`,
                    block: blockRef,
                    timestamp: new Date(block.header.timestamp ?? 0),
                    customer: null,
                    jobId: getBatchId(p),
                    amount: p.amount,
                    twapPriceMicroUSD: null,
                }),
            );
            return;
        }
        case 'Minted': {
            const p = decodeEvent<MintedEvent>(event);
            await ctx.store.upsert(
                new MintEvent({
                    id: `${block.header.hash}-${event.index}`,
                    block: blockRef,
                    timestamp: new Date(block.header.timestamp ?? 0),
                    operator: p.operator,
                    jobId: null,
                    amount: p.amount,
                    epoch: null,
                }),
            );
            return;
        }
        default:
            ctx.log.debug({ event: event.name }, 'bme: unhandled');
    }
}

function getBatchId(event: BurnSubmittedEvent): string | null {
    return event.batchId ?? event.batch_id ?? null;
}
