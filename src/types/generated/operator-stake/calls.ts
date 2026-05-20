import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support.js'
import * as v6 from '../v6.js'

export const register =  {
    name: 'OperatorStake.register',
    /**
     * Register an operator. RFC-0003: stake-bound hotkey identity.
     * 
     * Reserves `stake` from the caller's free balance for the lifetime of
     * the registration. The reservation is released on `unregister` and
     * reduced by `slash`.
     */
    v6: new CallType(
        'OperatorStake.register',
        sts.struct({
            stake: sts.bigint(),
            attestationHash: v6.H256,
        })
    ),
}

export const unregister =  {
    name: 'OperatorStake.unregister',
    /**
     * Voluntarily unregister. Real version exits via unbonding window.
     * 
     * Releases the previously reserved stake back to the operator's free
     * balance.
     */
    v6: new CallType(
        'OperatorStake.unregister',
        sts.unit()
    ),
}

export const heartbeat =  {
    name: 'OperatorStake.heartbeat',
    /**
     * Heartbeat: extend liveness for the current epoch. RFC-0003.
     */
    v6: new CallType(
        'OperatorStake.heartbeat',
        sts.struct({
            epochNumber: sts.bigint(),
            capabilitiesSummaryHash: v6.H256,
            attestationReportHash: v6.H256,
        })
    ),
}

export const slash =  {
    name: 'OperatorStake.slash',
    /**
     * Slash hook called by `pallet-slashing` after dispute resolution.
     * 
     * Gated by `T::SlashOrigin` (typically `EnsureRoot` in dev / a
     * dedicated slashing-panel origin in production). Burns the slashed
     * amount from the operator's reserved balance.
     */
    v6: new CallType(
        'OperatorStake.slash',
        sts.struct({
            who: v6.AccountId32,
            amount: sts.bigint(),
            reasonCode: sts.number(),
        })
    ),
}
