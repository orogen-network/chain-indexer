import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support.js'
import * as v6 from '../v6.js'

export const proposeSpend =  {
    name: 'TreasuryExt.propose_spend',
    v6: new CallType(
        'TreasuryExt.propose_spend',
        sts.struct({
            beneficiary: v6.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const executeSpend =  {
    name: 'TreasuryExt.execute_spend',
    /**
     * Multisig-gated approval / execution.
     * 
     * Each caller must be a current `CouncilMembers` member and may
     * only approve a given proposal once. Once the unique approver set
     * reaches `Threshold`, the proposal is marked `Executed`. The
     * pallet does not move funds on its own — a separate spend
     * extrinsic in the runtime layers atop this signal.
     */
    v6: new CallType(
        'TreasuryExt.execute_spend',
        sts.struct({
            proposalId: sts.bigint(),
        })
    ),
}
