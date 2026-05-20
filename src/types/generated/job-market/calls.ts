import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support.js'
import * as v6 from '../v6.js'

export const submitJob =  {
    name: 'JobMarket.submit_job',
    v6: new CallType(
        'JobMarket.submit_job',
        sts.struct({
            jobId: v6.H256,
            gateway: v6.AccountId32,
            modelId: v6.H256,
            adapterId: sts.option(() => v6.H256),
        })
    ),
}

export const assign =  {
    name: 'JobMarket.assign',
    /**
     * Assign a job to an operator. Gated on `GatewayOrigin`.
     */
    v6: new CallType(
        'JobMarket.assign',
        sts.struct({
            jobId: v6.H256,
            operator: v6.AccountId32,
        })
    ),
}

export const finalize =  {
    name: 'JobMarket.finalize',
    /**
     * Finalize a job. Gated on `GatewayOrigin`.
     */
    v6: new CallType(
        'JobMarket.finalize',
        sts.struct({
            jobId: v6.H256,
        })
    ),
}

export const dispute =  {
    name: 'JobMarket.dispute',
    /**
     * Dispute a job. Only the customer or gateway recorded on the job
     * may dispute, and only while the job is `Submitted` or `Assigned`
     * — once `Finalized` or already `Disputed`, no further transition
     * is permitted.
     */
    v6: new CallType(
        'JobMarket.dispute',
        sts.struct({
            jobId: v6.H256,
        })
    ),
}
