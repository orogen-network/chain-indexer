import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support.js'
import * as v6 from '../v6.js'

export const submitWeights =  {
    name: 'YumaConsensus.submit_weights',
    v6: new CallType(
        'YumaConsensus.submit_weights',
        sts.struct({
            epoch: sts.bigint(),
            vector: sts.array(() => sts.tuple(() => [v6.AccountId32, sts.number()])),
        })
    ),
}

export const computeEpochIncentives =  {
    name: 'YumaConsensus.compute_epoch_incentives',
    v6: new CallType(
        'YumaConsensus.compute_epoch_incentives',
        sts.struct({
            epoch: sts.bigint(),
        })
    ),
}

export const addValidator =  {
    name: 'YumaConsensus.add_validator',
    v6: new CallType(
        'YumaConsensus.add_validator',
        sts.struct({
            validator: v6.AccountId32,
            stakeWeight: sts.bigint(),
            entityId: sts.number(),
        })
    ),
}

export const removeValidator =  {
    name: 'YumaConsensus.remove_validator',
    v6: new CallType(
        'YumaConsensus.remove_validator',
        sts.struct({
            validator: v6.AccountId32,
        })
    ),
}

export const updateValidatorStake =  {
    name: 'YumaConsensus.update_validator_stake',
    v6: new CallType(
        'YumaConsensus.update_validator_stake',
        sts.struct({
            validator: v6.AccountId32,
            stakeWeight: sts.bigint(),
            entityId: sts.number(),
        })
    ),
}

export const rotatePermits =  {
    name: 'YumaConsensus.rotate_permits',
    v6: new CallType(
        'YumaConsensus.rotate_permits',
        sts.struct({
            epoch: sts.bigint(),
        })
    ),
}
