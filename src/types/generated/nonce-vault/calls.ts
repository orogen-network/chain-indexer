import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support.js'
import * as v6 from '../v6.js'

export const recordNonce =  {
    name: 'NonceVault.record_nonce',
    /**
     * Record a customer-nonce. Gated on `GatewayOrigin` so arbitrary
     * signed accounts cannot pre-burn customer nonces.
     */
    v6: new CallType(
        'NonceVault.record_nonce',
        sts.struct({
            nonce: v6.H256,
        })
    ),
}
