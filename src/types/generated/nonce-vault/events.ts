import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support.js'
import * as v6 from '../v6.js'

export const nonceRecorded =  {
    name: 'NonceVault.NonceRecorded',
    v6: new EventType(
        'NonceVault.NonceRecorded',
        sts.struct({
            nonce: v6.H256,
        })
    ),
}

export const noncesPruned =  {
    name: 'NonceVault.NoncesPruned',
    v6: new EventType(
        'NonceVault.NoncesPruned',
        sts.struct({
            count: sts.number(),
        })
    ),
}
