import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support.js'
import * as v6 from '../v6.js'

export const submitted =  {
    name: 'AttestationRegistry.Submitted',
    v6: new EventType(
        'AttestationRegistry.Submitted',
        sts.struct({
            operator: v6.AccountId32,
            reportHash: v6.H256,
        })
    ),
}

export const revoked =  {
    name: 'AttestationRegistry.Revoked',
    v6: new EventType(
        'AttestationRegistry.Revoked',
        sts.struct({
            reportHash: v6.H256,
        })
    ),
}

export const crlAdded =  {
    name: 'AttestationRegistry.CrlAdded',
    v6: new EventType(
        'AttestationRegistry.CrlAdded',
        sts.struct({
            kind: v6.CrlKind,
            target: v6.H256,
        })
    ),
}
