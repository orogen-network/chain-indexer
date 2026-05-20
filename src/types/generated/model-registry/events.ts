import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support.js'
import * as v6 from '../v6.js'

export const baseModelRegistered =  {
    name: 'ModelRegistry.BaseModelRegistered',
    v6: new EventType(
        'ModelRegistry.BaseModelRegistered',
        sts.struct({
            id: v6.H256,
            owner: v6.AccountId32,
        })
    ),
}

export const adapterRegistered =  {
    name: 'ModelRegistry.AdapterRegistered',
    v6: new EventType(
        'ModelRegistry.AdapterRegistered',
        sts.struct({
            id: v6.H256,
            baseModelId: v6.H256,
            owner: v6.AccountId32,
        })
    ),
}

export const deprecated =  {
    name: 'ModelRegistry.Deprecated',
    v6: new EventType(
        'ModelRegistry.Deprecated',
        sts.struct({
            id: v6.H256,
        })
    ),
}
