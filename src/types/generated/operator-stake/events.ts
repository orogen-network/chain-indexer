import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support.js'
import * as v6 from '../v6.js'

export const registered =  {
    name: 'OperatorStake.Registered',
    v6: new EventType(
        'OperatorStake.Registered',
        sts.struct({
            who: v6.AccountId32,
            stake: sts.bigint(),
        })
    ),
}

export const unregistered =  {
    name: 'OperatorStake.Unregistered',
    v6: new EventType(
        'OperatorStake.Unregistered',
        sts.struct({
            who: v6.AccountId32,
        })
    ),
}

export const heartbeat =  {
    name: 'OperatorStake.Heartbeat',
    v6: new EventType(
        'OperatorStake.Heartbeat',
        sts.struct({
            who: v6.AccountId32,
            epoch: sts.bigint(),
        })
    ),
}

export const slashed =  {
    name: 'OperatorStake.Slashed',
    v6: new EventType(
        'OperatorStake.Slashed',
        sts.struct({
            who: v6.AccountId32,
            amount: sts.bigint(),
            reasonCode: sts.number(),
        })
    ),
}
