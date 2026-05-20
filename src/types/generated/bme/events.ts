import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support.js'
import * as v6 from '../v6.js'

export const burnSubmitted =  {
    name: 'Bme.BurnSubmitted',
    v6: new EventType(
        'Bme.BurnSubmitted',
        sts.struct({
            amount: sts.bigint(),
            batchId: v6.H256,
        })
    ),
}

export const minted =  {
    name: 'Bme.Minted',
    v6: new EventType(
        'Bme.Minted',
        sts.struct({
            operator: v6.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const elasticitySet =  {
    name: 'Bme.ElasticitySet',
    v6: new EventType(
        'Bme.ElasticitySet',
        sts.struct({
            elasticityBps: sts.number(),
        })
    ),
}
