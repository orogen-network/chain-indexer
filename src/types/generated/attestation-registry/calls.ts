import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support.js'
import * as v6 from '../v6.js'

export const submit =  {
    name: 'AttestationRegistry.submit',
    v6: new CallType(
        'AttestationRegistry.submit',
        sts.struct({
            reportHash: v6.H256,
            gpuUuid: v6.H256,
            vendorSet: sts.number(),
            measuredVmBundle: v6.H256,
            expiresAt: sts.number(),
        })
    ),
}

export const revoke =  {
    name: 'AttestationRegistry.revoke',
    /**
     * Revoke a previously-submitted attestation. Admin-gated.
     */
    v6: new CallType(
        'AttestationRegistry.revoke',
        sts.struct({
            reportHash: v6.H256,
        })
    ),
}

export const addToCrl =  {
    name: 'AttestationRegistry.add_to_crl',
    /**
     * Add an entry to the certificate revocation list. Admin-gated.
     */
    v6: new CallType(
        'AttestationRegistry.add_to_crl',
        sts.struct({
            kind: v6.CrlKind,
            target: v6.H256,
        })
    ),
}
