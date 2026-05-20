import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support.js'
import * as v6 from '../v6.js'

export const transcriptSubmitted =  {
    name: 'PouwMint.TranscriptSubmitted',
    v6: new EventType(
        'PouwMint.TranscriptSubmitted',
        sts.struct({
            operator: v6.AccountId32,
            hash: v6.H256,
        })
    ),
}

export const pouwRewardEmitted =  {
    name: 'PouwMint.PouwRewardEmitted',
    v6: new EventType(
        'PouwMint.PouwRewardEmitted',
        sts.struct({
            operator: v6.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
