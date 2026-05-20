import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support.js'
import * as v6 from '../v6.js'

export const sudo =  {
    name: 'Sudo.sudo',
    /**
     * Authenticates the sudo key and dispatches a function call with `Root` origin.
     */
    v6: new CallType(
        'Sudo.sudo',
        sts.struct({
            call: v6.Call,
        })
    ),
}

export const sudoUncheckedWeight =  {
    name: 'Sudo.sudo_unchecked_weight',
    /**
     * Authenticates the sudo key and dispatches a function call with `Root` origin.
     * This function does not check the weight of the call, and instead allows the
     * Sudo user to specify the weight of the call.
     * 
     * The dispatch origin for this call must be _Signed_.
     */
    v6: new CallType(
        'Sudo.sudo_unchecked_weight',
        sts.struct({
            call: v6.Call,
            weight: v6.Weight,
        })
    ),
}

export const setKey =  {
    name: 'Sudo.set_key',
    /**
     * Authenticates the current sudo key and sets the given AccountId (`new`) as the new sudo
     * key.
     */
    v6: new CallType(
        'Sudo.set_key',
        sts.struct({
            new: v6.MultiAddress,
        })
    ),
}

export const sudoAs =  {
    name: 'Sudo.sudo_as',
    /**
     * Authenticates the sudo key and dispatches a function call with `Signed` origin from
     * a given account.
     * 
     * The dispatch origin for this call must be _Signed_.
     */
    v6: new CallType(
        'Sudo.sudo_as',
        sts.struct({
            who: v6.MultiAddress,
            call: v6.Call,
        })
    ),
}

export const removeKey =  {
    name: 'Sudo.remove_key',
    /**
     * Permanently removes the sudo key.
     * 
     * **This cannot be un-done.**
     */
    v6: new CallType(
        'Sudo.remove_key',
        sts.unit()
    ),
}
