import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support.js'
import * as v6 from '../v6.js'

export const transactionFeePaid =  {
    name: 'TransactionPayment.TransactionFeePaid',
    /**
     * A transaction fee `actual_fee`, of which `tip` was added to the minimum inclusion fee,
     * has been paid by `who`.
     */
    v6: new EventType(
        'TransactionPayment.TransactionFeePaid',
        sts.struct({
            who: v6.AccountId32,
            actualFee: sts.bigint(),
            tip: sts.bigint(),
        })
    ),
}
