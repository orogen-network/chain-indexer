/**
 * Entry point for the Orogen chain indexer.
 *
 * Wires a Subsquid `SubstrateBatchProcessor` to:
 *   - the local chain-node RPC (`ws://127.0.0.1:9944` by default)
 *   - an optional Subsquid Archive gateway for fast historical sync
 *
 * Indexes:
 *   - Block + extrinsic + event for every block.
 *   - `pallet-job-market` job lifecycle.
 *   - `pallet-bme` burn + mint events.
 *   - `pallet-slashing` slash + dispute events.
 *   - `pallet-operator-stake` register + heartbeat.
 *
 * Status: skeleton. Event-name strings are placeholders until pallet-suite
 * metadata is published (running `sqd typegen` against the live chain
 * generates the strongly-typed event accessors that replace
 * `src/types/events.ts`).
 */
import { SubstrateBatchProcessor } from '@subsquid/substrate-processor';
import { TypeormDatabase } from '@subsquid/typeorm-store';

import { config } from './config.js';
import { handleBme } from './handlers/bme.js';
import { handleJobs } from './handlers/jobs.js';
import { handleOperators } from './handlers/operators.js';
import { handleSlashing } from './handlers/slashing.js';
import { recordBlockAndExtrinsics } from './handlers/core.js';
import { FIELDS, type Ctx } from './types/context.js';

/**
 * (pallet, event-name) pairs we subscribe to. Concrete names track the
 * `#[pallet::event]` definitions in pallet-suite; if the runtime metadata
 * renames them, update this list.
 */
export const TRACKED_EVENTS: string[] = [
    'JobMarket.JobSubmitted',
    'JobMarket.JobAssigned',
    'JobMarket.JobFinalized',
    'JobMarket.JobDisputed',
    'Bme.Burned',
    'Bme.Minted',
    'Slashing.SlashOpened',
    'Slashing.SlashConfirmed',
    'Slashing.DisputeOpened',
    'OperatorStake.Registered',
    'OperatorStake.Heartbeat',
    'OperatorStake.Slashed',
];

// Build the processor with the configured RPC / archive endpoints and the
// set of (pallet, event) pairs we care about.
//
// `includeAllBlocks()` makes the processor deliver every block in the range
// to the handler, regardless of whether it matched any event subscription.
// We need that for the explorer's "recent blocks" view — most blocks on
// the skeleton forge testnet contain no custom pallet events, but they
// still need a Block/Extrinsic row written.
export function buildProcessor(): SubstrateBatchProcessor<typeof FIELDS> {
    const processor = new SubstrateBatchProcessor()
        .setRpcEndpoint({ url: config.rpcEndpoint, rateLimit: 10 })
        .setBlockRange({ from: config.startBlock, to: config.stopBlock })
        .setFields(FIELDS)
        .addEvent({ name: TRACKED_EVENTS })
        .includeAllBlocks();

    if (config.archiveGateway) {
        processor.setGateway({ url: config.archiveGateway });
    }

    return processor;
}

/**
 * Dispatch a single event to its pallet handler. Exported so unit tests
 * can drive each handler with a synthetic event.
 */
export async function dispatchEvent(
    ctx: Ctx,
    block: Ctx['blocks'][number],
    event: Ctx['blocks'][number]['events'][number],
): Promise<void> {
    const pallet = event.name.split('.')[0];
    switch (pallet) {
        case 'JobMarket':
            await handleJobs(ctx, block, event);
            break;
        case 'Bme':
            await handleBme(ctx, block, event);
            break;
        case 'Slashing':
            await handleSlashing(ctx, block, event);
            break;
        case 'OperatorStake':
            await handleOperators(ctx, block, event);
            break;
        default:
            // unhandled pallet: still captured by `recordBlockAndExtrinsics`.
            break;
    }
}

/**
 * Main processing loop. Called by `npm run processor:start`.
 *
 * Tests bypass this by importing `buildProcessor` directly and asserting on
 * its configuration.
 */
export async function main(): Promise<void> {
    const processor = buildProcessor();
    const db = new TypeormDatabase({ supportHotBlocks: true });

    await processor.run(db, async (ctx) => {
        for (const block of ctx.blocks) {
            await recordBlockAndExtrinsics(ctx, block);
            for (const event of block.events) {
                await dispatchEvent(ctx, block, event);
            }
        }
    });
}

// `process.argv[1]` reliably distinguishes "run as script" from "imported".
const invokedAsScript = process.argv[1] && process.argv[1].endsWith('main.js');
if (invokedAsScript) {
    main().catch((err) => {
        // eslint-disable-next-line no-console
        console.error('chain-indexer: fatal:', err);
        process.exit(1);
    });
}
