/**
 * Sanity tests for the indexer wiring. Run with `npm test`.
 *
 * These don't bring up Postgres or hit a live chain — they only verify
 * that the processor builder is wired correctly and that the tracked-event
 * list covers every pallet documented in `schema.graphql`.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

import { buildProcessor, TRACKED_EVENTS } from '../src/main.js';
import { config } from '../src/config.js';
import { MIGRATIONS, createDataSource } from '../src/db.js';
import { decodeEvent, generatedEventNames as generatedDecoderEventNames } from '../src/types/events.js';
import pkg from '../package.json' with { type: 'json' };

const originalOrogenEnv = process.env.OROGEN_ENV;
const FINAL_PALLET_SUITE_REV = 'ca947b089344226e455dfcaccafedd7f14fe53ce';

afterEach(() => {
    if (originalOrogenEnv === undefined) {
        delete process.env.OROGEN_ENV;
    } else {
        process.env.OROGEN_ENV = originalOrogenEnv;
    }
});

describe('chain-indexer wiring', () => {
    it('buildProcessor returns a configured processor', () => {
        const p = buildProcessor();
        expect(p).toBeDefined();
    });

    it('requests complete event and extrinsic relations', () => {
        const p = buildProcessor() as unknown as {
            getBatchRequests: () => Array<{
                request: {
                    includeAllBlocks?: boolean;
                    events?: Array<{ extrinsic?: boolean }>;
                    calls?: Array<{ extrinsic?: boolean; events?: boolean }>;
                };
            }>;
        };
        const requests = p.getBatchRequests();
        expect(requests).toHaveLength(1);
        expect(requests[0]?.request.includeAllBlocks).toBe(true);
        expect(requests[0]?.request.events).toEqual([{ extrinsic: true }]);
        expect(requests[0]?.request.calls).toEqual([{ extrinsic: true, events: true }]);
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

    it('tracks current runtime event names', () => {
        expect(TRACKED_EVENTS).toContain('Bme.BurnSubmitted');
        expect(TRACKED_EVENTS).toContain('Bme.ElasticitySet');
        expect(TRACKED_EVENTS).toContain('Slashing.SlashSubmitted');
        expect(TRACKED_EVENTS).toContain('Slashing.SlashDisputed');
        expect(TRACKED_EVENTS).toContain('Slashing.SlashRatified');
        expect(TRACKED_EVENTS).toContain('Slashing.SlashFinalized');
        expect(TRACKED_EVENTS).not.toContain('Bme.Burned');
        expect(TRACKED_EVENTS).not.toContain('Slashing.SlashOpened');
        expect(TRACKED_EVENTS).not.toContain('Slashing.SlashConfirmed');
        expect(TRACKED_EVENTS).not.toContain('Slashing.DisputeOpened');
    });

    it('tracks the full current operator-stake lifecycle', () => {
        expect(TRACKED_EVENTS).toContain('OperatorStake.Registered');
        expect(TRACKED_EVENTS).toContain('OperatorStake.Unregistered');
        expect(TRACKED_EVENTS).toContain('OperatorStake.Heartbeat');
        expect(TRACKED_EVENTS).toContain('OperatorStake.Slashed');
    });

    it('release database path uses migrations, not TypeORM schema sync', () => {
        expect(pkg.scripts['db:migrate']).toBe('node --enable-source-maps dist/migrate.js');
        expect(pkg.scripts['start']).toBe('npm run processor:start:prod');
        expect(pkg.scripts['processor:start']).toBe('npm run processor:start:dev');
        expect(pkg.scripts['processor:start:dev']).toContain('OROGEN_ENV=${OROGEN_ENV:-development}');
        expect(pkg.scripts['processor:start:prod']).toBe(
            'OROGEN_ENV=production node --enable-source-maps dist/migrate.js && OROGEN_ENV=production node --enable-source-maps dist/main.js',
        );
        const ds = createDataSource({ synchronize: false });
        expect(ds.options.synchronize).toBe(false);
        expect(MIGRATIONS).toHaveLength(1);
    });

    it('checks the release migration against generated model metadata', () => {
        expect(pkg.scripts['db:migration:generate']).toBe('node scripts/generate-initial-migration.mjs --write');
        expect(pkg.scripts['db:migration:check']).toBe(
            'npm run build && node scripts/generate-initial-migration.mjs --check && node scripts/verify-migration-schema.mjs',
        );
    });

    it('has real Subsquid codegen and typegen scripts', () => {
        expect(pkg.scripts['codegen']).toBe('npm run codegen:models && npm run codegen:types && npm run codegen:post');
        expect(pkg.scripts['codegen:models']).toBe('squid-typeorm-codegen');
        expect(pkg.scripts['codegen:types']).toBe('squid-substrate-typegen typegen.json');
        expect(pkg.scripts['codegen:post']).toBe('node scripts/fix-generated-esm-imports.mjs');
        expect(pkg.scripts['generated:runtime-check']).toContain("import('./dist/model/index.js')");
        expect(pkg.scripts['generated:runtime-check']).toContain("import('./dist/types/generated/bme/events.js')");
        expect(pkg.scripts['metadata:explore']).toContain('squid-substrate-metadata-explorer');
    });

    it('tracks every current runtime event for indexed pallets', () => {
        expect(new Set(TRACKED_EVENTS)).toEqual(new Set(runtimeEvents()));
    });

    it('metadata-backed typegen covers the tracked indexed event names', () => {
        expect(new Set(generatedDecoderEventNames())).toEqual(new Set(TRACKED_EVENTS));
    });

    it('captures metadata for the pinned Orogen runtime line', () => {
        const metadata = JSON.parse(readFileSync(resolve(repoRoot(), 'chain-indexer/metadata/specVersions.json'), 'utf8'));
        expect(metadata).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    specName: 'orogen',
                    specVersion: 6,
                    blockNumber: 0,
                }),
            ]),
        );

        const runtime = readFileSync(resolve(repoRoot(), 'pallet-suite/runtime/src/lib.rs'), 'utf8');
        expect(runtime).toContain('spec_name: alloc::borrow::Cow::Borrowed("orogen")');
        expect(runtime).toContain('impl_name: alloc::borrow::Cow::Borrowed("orogen")');
        expect(runtime).toContain('spec_version: 6');
        expect(runtime).toContain('transaction_version: 6');

        const chainNodeManifest = readFileSync(resolve(repoRoot(), 'chain-node/Cargo.toml'), 'utf8');
        expect(chainNodeManifest).toContain(`rev = "${FINAL_PALLET_SUITE_REV}"`);
    });

    it('prefers generated metadata decoders when runtime context is present', () => {
        const decoded = { operator: 'op1', amount: 42n };
        const event = {
            name: 'Bme.Minted',
            args: { operator: 'fallback', amount: 1n },
            block: {
                _runtime: {
                    specVersion: 6,
                    events: { checkType: () => true },
                    decodeJsonEventRecordArguments: () => decoded,
                },
            },
        };
        expect(decodeEvent<typeof decoded>(event)).toBe(decoded);
    });

    it('selects generated decoders by runtime specVersion', () => {
        const event = {
            name: 'Bme.Minted',
            args: { operator: 'fallback', amount: 1n },
            block: {
                _runtime: {
                    specVersion: 5,
                    events: { checkType: () => true },
                    decodeJsonEventRecordArguments: () => ({ operator: 'wrong', amount: 2n }),
                },
            },
        };
        expect(() => decodeEvent(event)).toThrow(/does not include runtime specVersion v5/);
    });

    it('falls back to raw args when runtime metadata is absent', () => {
        process.env.OROGEN_ENV = 'development';
        const args = { operator: 'fallback', amount: 1n };
        expect(decodeEvent<typeof args>({ name: 'Bme.Minted', args })).toBe(args);
    });

    it('refuses raw args fallback for tracked events in production', () => {
        process.env.OROGEN_ENV = 'production';
        expect(() => decodeEvent({ name: 'Bme.Minted', args: { operator: 'fallback', amount: 1n } })).toThrow(
            /refusing raw event args fallback/,
        );
    });

    it('refuses runtime metadata mismatch instead of falling back', () => {
        process.env.OROGEN_ENV = 'development';
        const event = {
            name: 'Bme.Minted',
            args: { operator: 'fallback', amount: 1n },
            block: {
                _runtime: {
                    specVersion: 6,
                    events: { checkType: () => false },
                    decodeJsonEventRecordArguments: () => ({ operator: 'wrong', amount: 2n }),
                },
            },
        };
        expect(() => decodeEvent(event)).toThrow(/generated metadata decoder does not match/);
    });
});

function runtimeEvents(): string[] {
    const pallets: Array<[string, string]> = [
        ['job-market', 'JobMarket'],
        ['bme', 'Bme'],
        ['slashing', 'Slashing'],
        ['operator-stake', 'OperatorStake'],
    ];

    return pallets.flatMap(([repoName, palletName]) => {
        const source = readFileSync(
            resolve(fileURLToPath(new URL('.', import.meta.url)), `../../pallet-suite/pallets/${repoName}/src/lib.rs`),
            'utf8',
        );
        return extractEventNames(source).map((eventName) => `${palletName}.${eventName}`);
    });
}

function repoRoot(): string {
    return resolve(fileURLToPath(new URL('.', import.meta.url)), '../..');
}

function extractEventNames(source: string): string[] {
    const enumStart = source.indexOf('pub enum Event');
    if (enumStart < 0) throw new Error('missing #[pallet::event] enum');

    const bodyStart = source.indexOf('{', enumStart);
    if (bodyStart < 0) throw new Error('missing event enum body');

    const names: string[] = [];
    let depth = 0;
    let current = '';

    for (let i = bodyStart; i < source.length; i += 1) {
        const char = source[i];
        if (char === '{') {
            depth += 1;
            if (depth === 2) {
                const match = current.match(/([A-Z][A-Za-z0-9_]*)\s*$/);
                if (match?.[1]) names.push(match[1]);
                current = '';
            }
            continue;
        }
        if (char === '}') {
            depth -= 1;
            if (depth === 0) return names;
            current = '';
            continue;
        }
        if (depth === 1) {
            current += char;
        }
    }

    throw new Error('unterminated event enum');
}
