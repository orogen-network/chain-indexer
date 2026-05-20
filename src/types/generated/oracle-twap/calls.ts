import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support.js'

export const submitPrice =  {
    name: 'OracleTwap.submit_price',
    v6: new CallType(
        'OracleTwap.submit_price',
        sts.struct({
            price: sts.bigint(),
        })
    ),
}
