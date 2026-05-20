import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support.js'
import * as v6 from '../v6.js'

export const extrinsicSuccess =  {
    name: 'System.ExtrinsicSuccess',
    /**
     * An extrinsic completed successfully.
     */
    v6: new EventType(
        'System.ExtrinsicSuccess',
        sts.struct({
            dispatchInfo: v6.DispatchEventInfo,
        })
    ),
}

export const extrinsicFailed =  {
    name: 'System.ExtrinsicFailed',
    /**
     * An extrinsic failed.
     */
    v6: new EventType(
        'System.ExtrinsicFailed',
        sts.struct({
            dispatchError: v6.DispatchError,
            dispatchInfo: v6.DispatchEventInfo,
        })
    ),
}

export const codeUpdated =  {
    name: 'System.CodeUpdated',
    /**
     * `:code` was updated to the code with the given hash.
     */
    v6: new EventType(
        'System.CodeUpdated',
        sts.struct({
            hash: v6.H256,
        })
    ),
}

export const newAccount =  {
    name: 'System.NewAccount',
    /**
     * A new account was created.
     */
    v6: new EventType(
        'System.NewAccount',
        sts.struct({
            account: v6.AccountId32,
        })
    ),
}

export const killedAccount =  {
    name: 'System.KilledAccount',
    /**
     * An account was reaped.
     */
    v6: new EventType(
        'System.KilledAccount',
        sts.struct({
            account: v6.AccountId32,
        })
    ),
}

export const remarked =  {
    name: 'System.Remarked',
    /**
     * On on-chain remark happened.
     */
    v6: new EventType(
        'System.Remarked',
        sts.struct({
            sender: v6.AccountId32,
            hash: v6.H256,
        })
    ),
}

export const upgradeAuthorized =  {
    name: 'System.UpgradeAuthorized',
    /**
     * An upgrade was authorized.
     */
    v6: new EventType(
        'System.UpgradeAuthorized',
        sts.struct({
            codeHash: v6.H256,
            checkVersion: sts.boolean(),
        })
    ),
}

export const rejectedInvalidAuthorizedUpgrade =  {
    name: 'System.RejectedInvalidAuthorizedUpgrade',
    /**
     * An invalid authorized upgrade was rejected while trying to apply it.
     */
    v6: new EventType(
        'System.RejectedInvalidAuthorizedUpgrade',
        sts.struct({
            codeHash: v6.H256,
            error: v6.DispatchError,
        })
    ),
}
