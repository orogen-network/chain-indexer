import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support.js'
import * as v6 from '../v6.js'

export const slashSubmitted =  {
    name: 'Slashing.SlashSubmitted',
    v6: new EventType(
        'Slashing.SlashSubmitted',
        sts.struct({
            slashId: sts.bigint(),
            operator: v6.AccountId32,
            faultCode: v6.FaultCode,
        })
    ),
}

export const slashDisputed =  {
    name: 'Slashing.SlashDisputed',
    v6: new EventType(
        'Slashing.SlashDisputed',
        sts.struct({
            slashId: sts.bigint(),
        })
    ),
}

export const slashArbitrated =  {
    name: 'Slashing.SlashArbitrated',
    v6: new EventType(
        'Slashing.SlashArbitrated',
        sts.struct({
            slashId: sts.bigint(),
            vote: v6.ArbitrationVote,
        })
    ),
}

export const slashRatified =  {
    name: 'Slashing.SlashRatified',
    v6: new EventType(
        'Slashing.SlashRatified',
        sts.struct({
            slashId: sts.bigint(),
            decision: v6.MultisigDecision,
        })
    ),
}

export const slashFinalized =  {
    name: 'Slashing.SlashFinalized',
    v6: new EventType(
        'Slashing.SlashFinalized',
        sts.struct({
            slashId: sts.bigint(),
        })
    ),
}
