/**
 * pallet-job-market event handler.
 *
 * Maintains a `Job` row per job id, transitioning through
 * Pending → Assigned → Finalized | Disputed.
 */
import type { Ctx, IndexerBlock, IndexerEvent } from '../types/context.js';
import { Job, JobStatus } from '../model/generated/index.js';
import {
    decodeEvent,
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
            const p = decodeEvent<JobSubmittedEvent>(event);
            const jobId = getJobId(p);
            const job = new Job({
                id: jobId,
                customer: p.customer,
                modelId: p.modelId ?? p.model_id ?? null,
                adapterId: p.adapterId ?? p.adapter_id ?? null,
                status: JobStatus.Pending,
                submittedAt: p.submittedAt ?? p.submitted_at ?? block.header.height,
                assignedTo: null,
                finalizedAt: null,
                receiptRoot: null,
                costMicroUSD: null,
            });
            await ctx.store.upsert(job);
            return;
        }
        case 'JobAssigned': {
            const p = decodeEvent<JobAssignedEvent>(event);
            const existing = await ctx.store.get(Job, getJobId(p));
            if (!existing) return;
            existing.status = JobStatus.Assigned;
            existing.assignedTo = p.operator;
            await ctx.store.upsert(existing);
            return;
        }
        case 'JobFinalized': {
            const p = decodeEvent<JobFinalizedEvent>(event);
            const existing = await ctx.store.get(Job, getJobId(p));
            if (!existing) return;
            existing.status = JobStatus.Finalized;
            existing.finalizedAt = p.finalizedAt ?? p.finalized_at ?? block.header.height;
            existing.receiptRoot = p.receiptRoot ?? p.receipt_root ?? null;
            existing.costMicroUSD = p.costMicroUSD ?? p.cost_micro_usd ?? null;
            await ctx.store.upsert(existing);
            return;
        }
        case 'JobDisputed': {
            const p = decodeEvent<JobDisputedEvent>(event);
            const existing = await ctx.store.get(Job, getJobId(p));
            if (!existing) return;
            existing.status = JobStatus.Disputed;
            await ctx.store.upsert(existing);
            return;
        }
        default:
            ctx.log.debug({ event: event.name, height: block.header.height }, 'jobs: unhandled');
    }
}

function getJobId(event: { jobId?: string; job_id?: string }): string {
    return event.jobId ?? event.job_id ?? '';
}
