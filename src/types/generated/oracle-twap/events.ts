import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support.js'

export const priceSubmitted =  {
    name: 'OracleTwap.PriceSubmitted',
    v6: new EventType(
        'OracleTwap.PriceSubmitted',
        sts.struct({
            price: sts.bigint(),
        })
    ),
}

export const twapUpdated =  {
    name: 'OracleTwap.TwapUpdated',
    v6: new EventType(
        'OracleTwap.TwapUpdated',
        sts.struct({
            twap: sts.bigint(),
        })
    ),
}
