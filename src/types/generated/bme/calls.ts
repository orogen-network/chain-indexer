import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support.js'
import * as v6 from '../v6.js'

export const submitBurn =  {
    name: 'Bme.submit_burn',
    /**
     * Gateway-submitted burn (RFC-0004 §submit_batch step 5).
     * 
     * Gated on `GatewayOrigin` — only verified gateways may extend the
     * network's recorded burn quantity, since this drives the mint
     * headroom.
     */
    v6: new CallType(
        'Bme.submit_burn',
        sts.struct({
            batchId: v6.H256,
            amount: sts.bigint(),
        })
    ),
}

export const mintToOperator =  {
    name: 'Bme.mint_to_operator',
    /**
     * Mint OROG to a single operator. In production, called by
     * `pallet-job-market::finalize_batch` after burn verification.
     * 
     * Gated on `MintOrigin`. Uses `checked_mul` for the headroom cap and
     * rejects on overflow instead of saturating to `u128::MAX`.
     */
    v6: new CallType(
        'Bme.mint_to_operator',
        sts.struct({
            operator: v6.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const setElasticity =  {
    name: 'Bme.set_elasticity',
    /**
     * Set elasticity factor (governance hook). Root / governance only.
     */
    v6: new CallType(
        'Bme.set_elasticity',
        sts.struct({
            elasticityBps: sts.number(),
        })
    ),
}
