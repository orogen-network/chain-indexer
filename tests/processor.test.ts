/**
 * Sanity tests for the indexer wiring. Run with `npm test`.
 *
 * These don't bring up Postgres or hit a live chain — they only verify
 * that the processor builder is wired correctly and that the tracked-event
 * list covers every pallet documented in `schema.graphql`.
 */
import { describe, expect, it } from 'vitest';

import { buildProcessor, TRACKED_EVENTS } from '../src/main.js';
import { config } from '../src/config.js';

describe('chain-indexer wiring', () => {
    it('buildProcessor returns a configured processor', () => {
        const p = buildProcessor();
        expect(p).toBeDefined();
    });

    it('default config points at local chain-node --dev RPC', () => {
        expect(config.rpcEndpoint).toBe('ws://127.0.0.1:9944');
        expect(config.startBlock).toBe(0);
    });

    it('tracks every documented pallet', () => {
        const pallets = new Set(TRACKED_EVENTS.map((n) => n.split('.')[0]));
        expect(pallets.has('JobMarket')).toBe(true);
        expect(pallets.has('Bme')).toBe(true);
        expect(pallets.has('Slashing')).toBe(true);
        expect(pallets.has('OperatorStake')).toBe(true);
    });
});
