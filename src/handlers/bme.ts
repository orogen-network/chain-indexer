/**
 * pallet-bme event handler. Captures burn + mint events as immutable rows.
 */
import type { Ctx, IndexerBlock, IndexerEvent } from '../types/context.js';
import { Block, BurnEvent, MintEvent } from '../model/index.js';
import { decode, type BurnedEvent, type MintedEvent } from '../types/events.js';

export async function handleBme(
    ctx: Ctx,
    block: IndexerBlock,
    event: IndexerEvent,
): Promise<void> {
    const blockRef = new Block({ id: block.header.hash });
    const [, name] = event.name.split('.');

    switch (name) {
        case 'Burned': {
            const p = decode<BurnedEvent>(event.args);
            await ctx.store.upsert(
                new BurnEvent({
                    id: `${block.header.hash}-${event.index}`,
                    block: blockRef,
                    timestamp: new Date(block.header.timestamp ?? 0),
                    customer: p.customer,
                    jobId: p.jobId,
                    amount: p.amount,
                    twapPriceMicroUSD: p.twapPriceMicroUSD,
                }),
            );
            return;
        }
        case 'Minted': {
            const p = decode<MintedEvent>(event.args);
            await ctx.store.upsert(
                new MintEvent({
                    id: `${block.header.hash}-${event.index}`,
                    block: blockRef,
                    timestamp: new Date(block.header.timestamp ?? 0),
                    operator: p.operator,
                    jobId: p.jobId,
                    amount: p.amount,
                    epoch: p.epoch,
                }),
            );
            return;
        }
        default:
            ctx.log.debug({ event: event.name }, 'bme: unhandled');
    }
}
