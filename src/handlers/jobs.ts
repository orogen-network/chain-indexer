/**
 * pallet-job-market event handler.
 *
 * Maintains a `Job` row per job id, transitioning through
 * Pending → Assigned → Finalized | Disputed.
 */
import type { Ctx, IndexerBlock, IndexerEvent } from '../types/context.js';
import { Job, JobStatus } from '../model/index.js';
import {
    decode,
    type JobAssignedEvent,
    type JobDisputedEvent,
    type JobFinalizedEvent,
    type JobSubmittedEvent,
} from '../types/events.js';

export async function handleJobs(
    ctx: Ctx,
    block: IndexerBlock,
    event: IndexerEvent,
): Promise<void> {
    const [, name] = event.name.split('.');
    switch (name) {
        case 'JobSubmitted': {
            const p = decode<JobSubmittedEvent>(event.args);
            const job = new Job({
                id: p.jobId,
                customer: p.customer,
                modelId: p.modelId,
                adapterId: p.adapterId,
                status: JobStatus.Pending,
                submittedAt: p.submittedAt,
                assignedTo: null,
                finalizedAt: null,
                receiptRoot: null,
                costMicroUSD: null,
            });
            await ctx.store.upsert(job);
            return;
        }
        case 'JobAssigned': {
            const p = decode<JobAssignedEvent>(event.args);
            const existing = await ctx.store.get(Job, p.jobId);
            if (!existing) return;
            existing.status = JobStatus.Assigned;
            existing.assignedTo = p.operator;
            await ctx.store.upsert(existing);
            return;
        }
        case 'JobFinalized': {
            const p = decode<JobFinalizedEvent>(event.args);
            const existing = await ctx.store.get(Job, p.jobId);
            if (!existing) return;
            existing.status = JobStatus.Finalized;
            existing.finalizedAt = p.finalizedAt;
            existing.receiptRoot = p.receiptRoot;
            existing.costMicroUSD = p.costMicroUSD;
            await ctx.store.upsert(existing);
            return;
        }
        case 'JobDisputed': {
            const p = decode<JobDisputedEvent>(event.args);
            const existing = await ctx.store.get(Job, p.jobId);
            if (!existing) return;
            existing.status = JobStatus.Disputed;
            await ctx.store.upsert(existing);
            return;
        }
        default:
            ctx.log.debug({ event: event.name, height: block.header.height }, 'jobs: unhandled');
    }
}
