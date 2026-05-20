import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support.js'
import * as v6 from '../v6.js'

export const registerBaseModel =  {
    name: 'ModelRegistry.register_base_model',
    /**
     * Register a new base model. The `id` is the content hash of the
     * weight manifest. Off-chain metadata (name / manifest URL) is the
     * caller's responsibility — the chain only stores hashes.
     */
    v6: new CallType(
        'ModelRegistry.register_base_model',
        sts.struct({
            id: v6.H256,
            manifestHash: v6.H256,
        })
    ),
}

export const registerAdapter =  {
    name: 'ModelRegistry.register_adapter',
    /**
     * Register a LoRA adapter against an existing base model.
     */
    v6: new CallType(
        'ModelRegistry.register_adapter',
        sts.struct({
            id: v6.H256,
            baseModelId: v6.H256,
            manifestHash: v6.H256,
        })
    ),
}

export const deprecate =  {
    name: 'ModelRegistry.deprecate',
    /**
     * Mark a base model or adapter as deprecated. Only owner.
     * 
     * Checks both `BaseModels` and `Adapters` maps so a deprecation
     * applies to whichever artifact (if any) the caller owns at this
     * id. Errors with `UnknownModel` if neither exists.
     */
    v6: new CallType(
        'ModelRegistry.deprecate',
        sts.struct({
            id: v6.H256,
        })
    ),
}
