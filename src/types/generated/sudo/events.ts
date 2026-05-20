import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support.js'
import * as v6 from '../v6.js'

export const sudid =  {
    name: 'Sudo.Sudid',
    /**
     * A sudo call just took place.
     */
    v6: new EventType(
        'Sudo.Sudid',
        sts.struct({
            /**
             * The result of the call made by the sudo user.
             */
            sudoResult: sts.result(() => sts.unit(), () => v6.DispatchError),
        })
    ),
}

export const keyChanged =  {
    name: 'Sudo.KeyChanged',
    /**
     * The sudo key has been updated.
     */
    v6: new EventType(
        'Sudo.KeyChanged',
        sts.struct({
            /**
             * The old sudo key (if one was previously set).
             */
            old: sts.option(() => v6.AccountId32),
            /**
             * The new sudo key (if one was set).
             */
            new: v6.AccountId32,
        })
    ),
}

export const keyRemoved =  {
    name: 'Sudo.KeyRemoved',
    /**
     * The key was permanently removed.
     */
    v6: new EventType(
        'Sudo.KeyRemoved',
        sts.unit()
    ),
}

export const sudoAsDone =  {
    name: 'Sudo.SudoAsDone',
    /**
     * A [sudo_as](Pallet::sudo_as) call just took place.
     */
    v6: new EventType(
        'Sudo.SudoAsDone',
        sts.struct({
            /**
             * The result of the call made by the sudo user.
             */
            sudoResult: sts.result(() => sts.unit(), () => v6.DispatchError),
        })
    ),
}
