import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support.js'
import * as v6 from '../v6.js'

export const newAuthorities =  {
    name: 'Grandpa.NewAuthorities',
    /**
     * New authority set has been applied.
     */
    v6: new EventType(
        'Grandpa.NewAuthorities',
        sts.struct({
            authoritySet: sts.array(() => sts.tuple(() => [v6.Public, sts.bigint()])),
        })
    ),
}

export const paused =  {
    name: 'Grandpa.Paused',
    /**
     * Current authority set has been paused.
     */
    v6: new EventType(
        'Grandpa.Paused',
        sts.unit()
    ),
}

export const resumed =  {
    name: 'Grandpa.Resumed',
    /**
     * Current authority set has been resumed.
     */
    v6: new EventType(
        'Grandpa.Resumed',
        sts.unit()
    ),
}
