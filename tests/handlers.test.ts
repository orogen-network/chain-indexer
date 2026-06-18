import { describe, expect, it } from 'vitest';

import { handleBme } from '../src/handlers/bme.js';
import { handleJobs } from '../src/handlers/jobs.js';
import { handleOperators } from '../src/handlers/operators.js';
import { handleSlashing } from '../src/handlers/slashing.js';
import {
    BurnEvent,
    Job,
    JobStatus,
    MintEvent,
    Operator,
    SlashEvent,
    SlashStatus,
} from '../src/model/generated/index.js';
import type { Ctx, IndexerBlock, IndexerEvent } from '../src/types/context.js';

describe('runtime-shaped handler payloads', () => {
    it('indexes job events emitted by the current runtime', async () => {
        const { ctx, store } = testCtx();
        await handleJobs(ctx, block(), event('JobMarket.JobSubmitted', { job_id: '0x01', customer: 'alice' }));
        await handleJobs(ctx, block(12), event('JobMarket.JobAssigned', { job_id: '0x01', operator: 'op1' }));
        await handleJobs(ctx, block(15), event('JobMarket.JobFinalized', { job_id: '0x01' }));

        const job = store.mustGet(Job, '0x01');
        expect(job.customer).toBe('alice');
        expect(job.modelId).toBeNull();
        expect(job.status).toBe(JobStatus.Finalized);
        expect(job.assignedTo).toBe('op1');
        expect(job.finalizedAt).toBe(15);
    });

    it('indexes operator events emitted by the current runtime', async () => {
        const { ctx, store } = testCtx();
        await handleOperators(ctx, block(8), event('OperatorStake.Registered', { who: 'op1', stake: 100n }));
        await handleOperators(ctx, block(9), event('OperatorStake.Heartbeat', { who: 'op1', epoch: 42n }));
        await handleOperators(ctx, block(10), event('OperatorStake.Slashed', { who: 'op1', amount: 30n, reason_code: 7 }));
        await handleOperators(ctx, block(11), event('OperatorStake.Unregistered', { who: 'op1' }));

        const operator = store.mustGet(Operator, 'op1');
        expect(operator.registeredAt).toBe(8);
        expect(operator.lastHeartbeat).toBe(42);
        expect(operator.stake).toBe(0n);
        expect(operator.active).toBe(false);
    });

    it('does not fabricate unavailable BME dimensions', async () => {
        const { ctx, store } = testCtx();
        await handleBme(ctx, block(), event('Bme.BurnSubmitted', { amount: 55n, batch_id: '0xbeef' }));
        await handleBme(ctx, block(), event('Bme.Minted', { operator: 'op1', amount: 22n }, 1));

        const burn = store.mustGet(BurnEvent, '0xblock-0');
        expect(burn.amount).toBe(55n);
        expect(burn.customer).toBeNull();
        expect(burn.jobId).toBe('0xbeef');
        expect(burn.twapPriceMicroUSD).toBeNull();

        const mint = store.mustGet(MintEvent, '0xblock-1');
        expect(mint.operator).toBe('op1');
        expect(mint.epoch).toBeNull();
    });

    it('moves directly finalized slashes out of open state', async () => {
        const { ctx, store } = testCtx();
        await handleSlashing(ctx, block(20), event('Slashing.SlashSubmitted', {
            slash_id: 7,
            operator: 'op1',
            fault_code: { __kind: 'WrongResponse' },
        }));
        await handleSlashing(ctx, block(30), event('Slashing.SlashFinalized', { slash_id: 7 }));

        const slash = store.mustGet(SlashEvent, 'slash-7');
        expect(slash.status).toBe(SlashStatus.Confirmed);
        expect(slash.kind).toBe('ReceiptMismatch');
        expect(slash.resolvedAt).toBe(30);
        expect(slash.amount).toBeNull();
        expect(slash.reasonHash).toBeNull();
    });

    it('ratifies generated enum-shaped slashing decisions', async () => {
        const { ctx, store } = testCtx();
        await handleSlashing(ctx, block(20), event('Slashing.SlashSubmitted', {
            slash_id: 8,
            operator: 'op1',
            fault_code: { __kind: 'HeartbeatMiss' },
        }));
        await handleSlashing(ctx, block(25), event('Slashing.SlashRatified', {
            slash_id: 8,
            decision: { __kind: 'Uphold' },
        }));

        const slash = store.mustGet(SlashEvent, 'slash-8');
        expect(slash.kind).toBe('MissedHeartbeat');
        expect(slash.status).toBe(SlashStatus.Confirmed);
        expect(slash.resolvedAt).toBe(25);
    });

    it('maps every FaultCode variant to the right SlashKind and preserves faultCode', async () => {
        // Regression guard for the lossy SlashKind mapping: the old dead
        // `code in SlashKind` branch + substring heuristics bucketed 10 of 13
        // variants to Other and misclassified ValidatorCollusion as
        // DisputeUpheld. Exhaustive coverage of all 13 runtime FaultCode
        // variants + the faultCode-preservation field.
        const cases: Array<[string, string]> = [
            ['WrongResponse', 'ReceiptMismatch'],
            ['LogProbDrift', 'ReceiptMismatch'],
            ['CacheReplay', 'ReceiptMismatch'],
            ['HeartbeatMiss', 'MissedHeartbeat'],
            ['AttestationStale', 'AttestationRevoked'],
            ['DeviceCertCollision', 'AttestationRevoked'],
            ['WrongModel', 'Other'],
            ['QuantizationSwap', 'Other'],
            ['KernelPackMismatch', 'Other'],
            ['SanctionsHit', 'Other'],
            ['ValidatorCollusion', 'Other'],
            ['FakeBurn', 'Other'],
            ['BatchOvercommit', 'Other'],
        ];
        for (let i = 0; i < cases.length; i++) {
            const [code, expectedKind] = cases[i];
            const { ctx, store } = testCtx();
            await handleSlashing(ctx, block(40), event('Slashing.SlashSubmitted', {
                slash_id: 100 + i,
                operator: 'op1',
                fault_code: { __kind: code },
            }));
            const slash = store.mustGet(SlashEvent, `slash-${100 + i}`);
            expect(slash.kind).toBe(expectedKind);
            expect(slash.faultCode).toBe(code);
        }
    });
});

class TestStore {
    private rows = new Map<string, Map<string, unknown>>();

    async upsert<T extends { id: string }>(entity: T): Promise<void> {
        const key = entity.constructor.name;
        const table = this.rows.get(key) ?? new Map<string, unknown>();
        table.set(entity.id, entity);
        this.rows.set(key, table);
    }

    async get<T>(ctor: new (...args: never[]) => T, id: string): Promise<T | undefined> {
        return this.rows.get(ctor.name)?.get(id) as T | undefined;
    }

    mustGet<T>(ctor: new (...args: never[]) => T, id: string): T {
        const value = this.rows.get(ctor.name)?.get(id) as T | undefined;
        if (!value) throw new Error(`missing ${ctor.name}:${id}`);
        return value;
    }
}

function testCtx(): { ctx: Ctx; store: TestStore } {
    const store = new TestStore();
    const ctx = {
        store,
        log: {
            debug: () => undefined,
            warn: () => undefined,
        },
    } as unknown as Ctx;
    return { ctx, store };
}

function block(height = 10): IndexerBlock {
    return {
        header: {
            hash: '0xblock',
            height,
            timestamp: 1_716_120_000_000,
        },
    } as unknown as IndexerBlock;
}

function event(name: string, args: unknown, index = 0): IndexerEvent {
    return { name, args, index } as unknown as IndexerEvent;
}
