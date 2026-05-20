import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support.js'
import * as v6 from '../v6.js'

export const proposed =  {
    name: 'TreasuryExt.Proposed',
    v6: new EventType(
        'TreasuryExt.Proposed',
        sts.struct({
            proposalId: sts.bigint(),
            proposer: v6.AccountId32,
            beneficiary: v6.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const approved =  {
    name: 'TreasuryExt.Approved',
    v6: new EventType(
        'TreasuryExt.Approved',
        sts.struct({
            proposalId: sts.bigint(),
            approver: v6.AccountId32,
            approvals: sts.number(),
        })
    ),
}

export const executed =  {
    name: 'TreasuryExt.Executed',
    v6: new EventType(
        'TreasuryExt.Executed',
        sts.struct({
            proposalId: sts.bigint(),
        })
    ),
}
