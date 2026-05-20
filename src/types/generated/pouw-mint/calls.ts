import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support.js'
import * as v6 from '../v6.js'

export const submitCupowTranscript =  {
    name: 'PouwMint.submit_cupow_transcript',
    v6: new CallType(
        'PouwMint.submit_cupow_transcript',
        sts.struct({
            transcriptHash: v6.H256,
        })
    ),
}

export const emitPouwReward =  {
    name: 'PouwMint.emit_pouw_reward',
    /**
     * Emit a PoUW reward event. Gated on `PoUWRewardOrigin` (Root until
     * the cuPOW lane activates).
     */
    v6: new CallType(
        'PouwMint.emit_pouw_reward',
        sts.struct({
            operator: v6.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
