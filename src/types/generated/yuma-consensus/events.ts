import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support.js'
import * as v6 from '../v6.js'

export const validatorAdded =  {
    name: 'YumaConsensus.ValidatorAdded',
    v6: new EventType(
        'YumaConsensus.ValidatorAdded',
        sts.struct({
            validator: v6.AccountId32,
            stakeWeight: sts.bigint(),
            entityId: sts.number(),
        })
    ),
}

export const validatorRemoved =  {
    name: 'YumaConsensus.ValidatorRemoved',
    v6: new EventType(
        'YumaConsensus.ValidatorRemoved',
        sts.struct({
            validator: v6.AccountId32,
        })
    ),
}

export const weightsSubmitted =  {
    name: 'YumaConsensus.WeightsSubmitted',
    v6: new EventType(
        'YumaConsensus.WeightsSubmitted',
        sts.struct({
            validator: v6.AccountId32,
            epoch: sts.bigint(),
            vectorLen: sts.number(),
        })
    ),
}

export const epochComputed =  {
    name: 'YumaConsensus.EpochComputed',
    v6: new EventType(
        'YumaConsensus.EpochComputed',
        sts.struct({
            epoch: sts.bigint(),
            operatorCount: sts.number(),
        })
    ),
}

export const validatorStakeUpdated =  {
    name: 'YumaConsensus.ValidatorStakeUpdated',
    v6: new EventType(
        'YumaConsensus.ValidatorStakeUpdated',
        sts.struct({
            validator: v6.AccountId32,
            stakeWeight: sts.bigint(),
            entityId: sts.number(),
        })
    ),
}

export const permitsRotated =  {
    name: 'YumaConsensus.PermitsRotated',
    v6: new EventType(
        'YumaConsensus.PermitsRotated',
        sts.struct({
            permittedCount: sts.number(),
        })
    ),
}
