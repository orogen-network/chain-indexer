import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support.js'
import * as v6 from '../v6.js'

export const jobSubmitted =  {
    name: 'JobMarket.JobSubmitted',
    v6: new EventType(
        'JobMarket.JobSubmitted',
        sts.struct({
            jobId: v6.H256,
            customer: v6.AccountId32,
        })
    ),
}

export const jobAssigned =  {
    name: 'JobMarket.JobAssigned',
    v6: new EventType(
        'JobMarket.JobAssigned',
        sts.struct({
            jobId: v6.H256,
            operator: v6.AccountId32,
        })
    ),
}

export const jobFinalized =  {
    name: 'JobMarket.JobFinalized',
    v6: new EventType(
        'JobMarket.JobFinalized',
        sts.struct({
            jobId: v6.H256,
        })
    ),
}

export const jobDisputed =  {
    name: 'JobMarket.JobDisputed',
    v6: new EventType(
        'JobMarket.JobDisputed',
        sts.struct({
            jobId: v6.H256,
        })
    ),
}
