import {sts, Result, Option, Bytes, BitSequence} from './support.js'

export const Weight: sts.Type<Weight> = sts.struct(() => {
    return  {
        refTime: sts.bigint(),
        proofSize: sts.bigint(),
    }
})

export interface Weight {
    refTime: bigint
    proofSize: bigint
}

export const Call: sts.Type<Call> = sts.closedEnum(() => {
    return  {
        AttestationRegistry: AttestationRegistryCall,
        Balances: BalancesCall,
        Bme: BmeCall,
        Grandpa: GrandpaCall,
        JobMarket: JobMarketCall,
        ModelRegistry: ModelRegistryCall,
        NonceVault: NonceVaultCall,
        OperatorStake: OperatorStakeCall,
        OracleTwap: OracleTwapCall,
        PouwMint: PouwMintCall,
        Slashing: SlashingCall,
        Sudo: SudoCall,
        System: SystemCall,
        Timestamp: TimestampCall,
        TreasuryExt: TreasuryExtCall,
        YumaConsensus: YumaConsensusCall,
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const YumaConsensusCall: sts.Type<YumaConsensusCall> = sts.closedEnum(() => {
    return  {
        add_validator: sts.enumStruct({
            validator: AccountId32,
            stakeWeight: sts.bigint(),
            entityId: sts.number(),
        }),
        compute_epoch_incentives: sts.enumStruct({
            epoch: sts.bigint(),
        }),
        remove_validator: sts.enumStruct({
            validator: AccountId32,
        }),
        rotate_permits: sts.enumStruct({
            epoch: sts.bigint(),
        }),
        submit_weights: sts.enumStruct({
            epoch: sts.bigint(),
            vector: sts.array(() => sts.tuple(() => [AccountId32, sts.number()])),
        }),
        update_validator_stake: sts.enumStruct({
            validator: AccountId32,
            stakeWeight: sts.bigint(),
            entityId: sts.number(),
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type YumaConsensusCall = YumaConsensusCall_add_validator | YumaConsensusCall_compute_epoch_incentives | YumaConsensusCall_remove_validator | YumaConsensusCall_rotate_permits | YumaConsensusCall_submit_weights | YumaConsensusCall_update_validator_stake

export interface YumaConsensusCall_add_validator {
    __kind: 'add_validator'
    validator: AccountId32
    stakeWeight: bigint
    entityId: number
}

export interface YumaConsensusCall_compute_epoch_incentives {
    __kind: 'compute_epoch_incentives'
    epoch: bigint
}

export interface YumaConsensusCall_remove_validator {
    __kind: 'remove_validator'
    validator: AccountId32
}

export interface YumaConsensusCall_rotate_permits {
    __kind: 'rotate_permits'
    epoch: bigint
}

export interface YumaConsensusCall_submit_weights {
    __kind: 'submit_weights'
    epoch: bigint
    vector: [AccountId32, number][]
}

export interface YumaConsensusCall_update_validator_stake {
    __kind: 'update_validator_stake'
    validator: AccountId32
    stakeWeight: bigint
    entityId: number
}

export type AccountId32 = Bytes

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const TreasuryExtCall: sts.Type<TreasuryExtCall> = sts.closedEnum(() => {
    return  {
        execute_spend: sts.enumStruct({
            proposalId: sts.bigint(),
        }),
        propose_spend: sts.enumStruct({
            beneficiary: AccountId32,
            amount: sts.bigint(),
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type TreasuryExtCall = TreasuryExtCall_execute_spend | TreasuryExtCall_propose_spend

/**
 * Multisig-gated approval / execution.
 * 
 * Each caller must be a current `CouncilMembers` member and may
 * only approve a given proposal once. Once the unique approver set
 * reaches `Threshold`, the proposal is marked `Executed`. The
 * pallet does not move funds on its own — a separate spend
 * extrinsic in the runtime layers atop this signal.
 */
export interface TreasuryExtCall_execute_spend {
    __kind: 'execute_spend'
    proposalId: bigint
}

export interface TreasuryExtCall_propose_spend {
    __kind: 'propose_spend'
    beneficiary: AccountId32
    amount: bigint
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const TimestampCall: sts.Type<TimestampCall> = sts.closedEnum(() => {
    return  {
        set: sts.enumStruct({
            now: sts.bigint(),
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type TimestampCall = TimestampCall_set

/**
 * Set the current time.
 * 
 * This call should be invoked exactly once per block. It will panic at the finalization
 * phase, if this call hasn't been invoked by that time.
 * 
 * The timestamp should be greater than the previous one by the amount specified by
 * [`Config::MinimumPeriod`].
 * 
 * The dispatch origin for this call must be _None_.
 * 
 * This dispatch class is _Mandatory_ to ensure it gets executed in the block. Be aware
 * that changing the complexity of this call could result exhausting the resources in a
 * block to execute any other calls.
 * 
 * ## Complexity
 * - `O(1)` (Note that implementations of `OnTimestampSet` must also be `O(1)`)
 * - 1 storage read and 1 storage mutation (codec `O(1)` because of `DidUpdate::take` in
 *   `on_finalize`)
 * - 1 event handler `on_timestamp_set`. Must be `O(1)`.
 */
export interface TimestampCall_set {
    __kind: 'set'
    now: bigint
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const SystemCall: sts.Type<SystemCall> = sts.closedEnum(() => {
    return  {
        apply_authorized_upgrade: sts.enumStruct({
            code: sts.bytes(),
        }),
        authorize_upgrade: sts.enumStruct({
            codeHash: H256,
        }),
        authorize_upgrade_without_checks: sts.enumStruct({
            codeHash: H256,
        }),
        kill_prefix: sts.enumStruct({
            prefix: sts.bytes(),
            subkeys: sts.number(),
        }),
        kill_storage: sts.enumStruct({
            keys: sts.array(() => sts.bytes()),
        }),
        remark: sts.enumStruct({
            remark: sts.bytes(),
        }),
        remark_with_event: sts.enumStruct({
            remark: sts.bytes(),
        }),
        set_code: sts.enumStruct({
            code: sts.bytes(),
        }),
        set_code_without_checks: sts.enumStruct({
            code: sts.bytes(),
        }),
        set_heap_pages: sts.enumStruct({
            pages: sts.bigint(),
        }),
        set_storage: sts.enumStruct({
            items: sts.array(() => sts.tuple(() => [sts.bytes(), sts.bytes()])),
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type SystemCall = SystemCall_apply_authorized_upgrade | SystemCall_authorize_upgrade | SystemCall_authorize_upgrade_without_checks | SystemCall_kill_prefix | SystemCall_kill_storage | SystemCall_remark | SystemCall_remark_with_event | SystemCall_set_code | SystemCall_set_code_without_checks | SystemCall_set_heap_pages | SystemCall_set_storage

/**
 * Provide the preimage (runtime binary) `code` for an upgrade that has been authorized.
 * 
 * If the authorization required a version check, this call will ensure the spec name
 * remains unchanged and that the spec version has increased.
 * 
 * Depending on the runtime's `OnSetCode` configuration, this function may directly apply
 * the new `code` in the same block or attempt to schedule the upgrade.
 * 
 * All origins are allowed.
 */
export interface SystemCall_apply_authorized_upgrade {
    __kind: 'apply_authorized_upgrade'
    code: Bytes
}

/**
 * Authorize an upgrade to a given `code_hash` for the runtime. The runtime can be supplied
 * later.
 * 
 * This call requires Root origin.
 */
export interface SystemCall_authorize_upgrade {
    __kind: 'authorize_upgrade'
    codeHash: H256
}

/**
 * Authorize an upgrade to a given `code_hash` for the runtime. The runtime can be supplied
 * later.
 * 
 * WARNING: This authorizes an upgrade that will take place without any safety checks, for
 * example that the spec name remains the same and that the version number increases. Not
 * recommended for normal use. Use `authorize_upgrade` instead.
 * 
 * This call requires Root origin.
 */
export interface SystemCall_authorize_upgrade_without_checks {
    __kind: 'authorize_upgrade_without_checks'
    codeHash: H256
}

/**
 * Kill all storage items with a key that starts with the given prefix.
 * 
 * **NOTE:** We rely on the Root origin to provide us the number of subkeys under
 * the prefix we are removing to accurately calculate the weight of this function.
 */
export interface SystemCall_kill_prefix {
    __kind: 'kill_prefix'
    prefix: Bytes
    subkeys: number
}

/**
 * Kill some items from storage.
 */
export interface SystemCall_kill_storage {
    __kind: 'kill_storage'
    keys: Bytes[]
}

/**
 * Make some on-chain remark.
 * 
 * Can be executed by every `origin`.
 */
export interface SystemCall_remark {
    __kind: 'remark'
    remark: Bytes
}

/**
 * Make some on-chain remark and emit event.
 */
export interface SystemCall_remark_with_event {
    __kind: 'remark_with_event'
    remark: Bytes
}

/**
 * Set the new runtime code.
 */
export interface SystemCall_set_code {
    __kind: 'set_code'
    code: Bytes
}

/**
 * Set the new runtime code without doing any checks of the given `code`.
 * 
 * Note that runtime upgrades will not run if this is called with a not-increasing spec
 * version!
 */
export interface SystemCall_set_code_without_checks {
    __kind: 'set_code_without_checks'
    code: Bytes
}

/**
 * Set the number of pages in the WebAssembly environment's heap.
 */
export interface SystemCall_set_heap_pages {
    __kind: 'set_heap_pages'
    pages: bigint
}

/**
 * Set some items of storage.
 */
export interface SystemCall_set_storage {
    __kind: 'set_storage'
    items: [Bytes, Bytes][]
}

export type H256 = Bytes

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const SudoCall: sts.Type<SudoCall> = sts.closedEnum(() => {
    return  {
        remove_key: sts.unit(),
        set_key: sts.enumStruct({
            new: MultiAddress,
        }),
        sudo: sts.enumStruct({
            call: Call,
        }),
        sudo_as: sts.enumStruct({
            who: MultiAddress,
            call: Call,
        }),
        sudo_unchecked_weight: sts.enumStruct({
            call: Call,
            weight: Weight,
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type SudoCall = SudoCall_remove_key | SudoCall_set_key | SudoCall_sudo | SudoCall_sudo_as | SudoCall_sudo_unchecked_weight

/**
 * Permanently removes the sudo key.
 * 
 * **This cannot be un-done.**
 */
export interface SudoCall_remove_key {
    __kind: 'remove_key'
}

/**
 * Authenticates the current sudo key and sets the given AccountId (`new`) as the new sudo
 * key.
 */
export interface SudoCall_set_key {
    __kind: 'set_key'
    new: MultiAddress
}

/**
 * Authenticates the sudo key and dispatches a function call with `Root` origin.
 */
export interface SudoCall_sudo {
    __kind: 'sudo'
    call: Call
}

/**
 * Authenticates the sudo key and dispatches a function call with `Signed` origin from
 * a given account.
 * 
 * The dispatch origin for this call must be _Signed_.
 */
export interface SudoCall_sudo_as {
    __kind: 'sudo_as'
    who: MultiAddress
    call: Call
}

/**
 * Authenticates the sudo key and dispatches a function call with `Root` origin.
 * This function does not check the weight of the call, and instead allows the
 * Sudo user to specify the weight of the call.
 * 
 * The dispatch origin for this call must be _Signed_.
 */
export interface SudoCall_sudo_unchecked_weight {
    __kind: 'sudo_unchecked_weight'
    call: Call
    weight: Weight
}

export type MultiAddress = MultiAddress_Address20 | MultiAddress_Address32 | MultiAddress_Id | MultiAddress_Index | MultiAddress_Raw

export interface MultiAddress_Address20 {
    __kind: 'Address20'
    value: Bytes
}

export interface MultiAddress_Address32 {
    __kind: 'Address32'
    value: Bytes
}

export interface MultiAddress_Id {
    __kind: 'Id'
    value: AccountId32
}

export interface MultiAddress_Index {
    __kind: 'Index'
}

export interface MultiAddress_Raw {
    __kind: 'Raw'
    value: Bytes
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const SlashingCall: sts.Type<SlashingCall> = sts.closedEnum(() => {
    return  {
        arbitrate_dispute: sts.enumStruct({
            slashId: sts.bigint(),
            vote: ArbitrationVote,
        }),
        dispute_slashing: sts.enumStruct({
            slashId: sts.bigint(),
            counterEvidenceHash: H256,
        }),
        finalize_slash: sts.enumStruct({
            slashId: sts.bigint(),
        }),
        ratify_dispute: sts.enumStruct({
            slashId: sts.bigint(),
            decision: MultisigDecision,
        }),
        submit_slashing_evidence: sts.enumStruct({
            operator: AccountId32,
            faultCode: FaultCode,
            evidenceHash: H256,
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type SlashingCall = SlashingCall_arbitrate_dispute | SlashingCall_dispute_slashing | SlashingCall_finalize_slash | SlashingCall_ratify_dispute | SlashingCall_submit_slashing_evidence

/**
 * Record an arbiter's vote. Gated on `PanelOrigin`. Once the panel
 * has voted, anyone in the panel calling this advances the state to
 * `Arbitrated`. Real quorum check is deferred; for now any single
 * `PanelOrigin` call advances the state and the votes are recorded.
 */
export interface SlashingCall_arbitrate_dispute {
    __kind: 'arbitrate_dispute'
    slashId: bigint
    vote: ArbitrationVote
}

/**
 * Dispute a pending slash. Open to the signed operator under fire
 * (caller-identity check is deferred — the panel decides on merits).
 */
export interface SlashingCall_dispute_slashing {
    __kind: 'dispute_slashing'
    slashId: bigint
    counterEvidenceHash: H256
}

/**
 * Move a `Pending` slash that was not disputed inside the window to
 * `Finalized`. Gated on `PanelOrigin` (root or scheduler).
 */
export interface SlashingCall_finalize_slash {
    __kind: 'finalize_slash'
    slashId: bigint
}

/**
 * Ratify an arbitrated dispute. Gated on `PanelOrigin`.
 */
export interface SlashingCall_ratify_dispute {
    __kind: 'ratify_dispute'
    slashId: bigint
    decision: MultisigDecision
}

/**
 * Submit verified slashing evidence. Gated on `EvidenceOrigin` so
 * that arbitrary signed accounts cannot open spurious slashes.
 */
export interface SlashingCall_submit_slashing_evidence {
    __kind: 'submit_slashing_evidence'
    operator: AccountId32
    faultCode: FaultCode
    evidenceHash: H256
}

export type FaultCode = FaultCode_AttestationStale | FaultCode_BatchOvercommit | FaultCode_CacheReplay | FaultCode_DeviceCertCollision | FaultCode_FakeBurn | FaultCode_HeartbeatMiss | FaultCode_KernelPackMismatch | FaultCode_LogProbDrift | FaultCode_QuantizationSwap | FaultCode_SanctionsHit | FaultCode_ValidatorCollusion | FaultCode_WrongModel | FaultCode_WrongResponse

export interface FaultCode_AttestationStale {
    __kind: 'AttestationStale'
}

export interface FaultCode_BatchOvercommit {
    __kind: 'BatchOvercommit'
}

export interface FaultCode_CacheReplay {
    __kind: 'CacheReplay'
}

export interface FaultCode_DeviceCertCollision {
    __kind: 'DeviceCertCollision'
}

export interface FaultCode_FakeBurn {
    __kind: 'FakeBurn'
}

export interface FaultCode_HeartbeatMiss {
    __kind: 'HeartbeatMiss'
}

export interface FaultCode_KernelPackMismatch {
    __kind: 'KernelPackMismatch'
}

export interface FaultCode_LogProbDrift {
    __kind: 'LogProbDrift'
}

export interface FaultCode_QuantizationSwap {
    __kind: 'QuantizationSwap'
}

export interface FaultCode_SanctionsHit {
    __kind: 'SanctionsHit'
}

export interface FaultCode_ValidatorCollusion {
    __kind: 'ValidatorCollusion'
}

export interface FaultCode_WrongModel {
    __kind: 'WrongModel'
}

export interface FaultCode_WrongResponse {
    __kind: 'WrongResponse'
}

export type MultisigDecision = MultisigDecision_Overturn | MultisigDecision_Uphold

export interface MultisigDecision_Overturn {
    __kind: 'Overturn'
}

export interface MultisigDecision_Uphold {
    __kind: 'Uphold'
}

export type ArbitrationVote = ArbitrationVote_Insufficient | ArbitrationVote_Overturn | ArbitrationVote_Uphold

export interface ArbitrationVote_Insufficient {
    __kind: 'Insufficient'
}

export interface ArbitrationVote_Overturn {
    __kind: 'Overturn'
}

export interface ArbitrationVote_Uphold {
    __kind: 'Uphold'
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const PouwMintCall: sts.Type<PouwMintCall> = sts.closedEnum(() => {
    return  {
        emit_pouw_reward: sts.enumStruct({
            operator: AccountId32,
            amount: sts.bigint(),
        }),
        submit_cupow_transcript: sts.enumStruct({
            transcriptHash: H256,
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type PouwMintCall = PouwMintCall_emit_pouw_reward | PouwMintCall_submit_cupow_transcript

/**
 * Emit a PoUW reward event. Gated on `PoUWRewardOrigin` (Root until
 * the cuPOW lane activates).
 */
export interface PouwMintCall_emit_pouw_reward {
    __kind: 'emit_pouw_reward'
    operator: AccountId32
    amount: bigint
}

export interface PouwMintCall_submit_cupow_transcript {
    __kind: 'submit_cupow_transcript'
    transcriptHash: H256
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const OracleTwapCall: sts.Type<OracleTwapCall> = sts.closedEnum(() => {
    return  {
        submit_price: sts.enumStruct({
            price: sts.bigint(),
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type OracleTwapCall = OracleTwapCall_submit_price

export interface OracleTwapCall_submit_price {
    __kind: 'submit_price'
    price: bigint
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const OperatorStakeCall: sts.Type<OperatorStakeCall> = sts.closedEnum(() => {
    return  {
        heartbeat: sts.enumStruct({
            epochNumber: sts.bigint(),
            capabilitiesSummaryHash: H256,
            attestationReportHash: H256,
        }),
        register: sts.enumStruct({
            stake: sts.bigint(),
            attestationHash: H256,
        }),
        slash: sts.enumStruct({
            who: AccountId32,
            amount: sts.bigint(),
            reasonCode: sts.number(),
        }),
        unregister: sts.unit(),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type OperatorStakeCall = OperatorStakeCall_heartbeat | OperatorStakeCall_register | OperatorStakeCall_slash | OperatorStakeCall_unregister

/**
 * Heartbeat: extend liveness for the current epoch. RFC-0003.
 */
export interface OperatorStakeCall_heartbeat {
    __kind: 'heartbeat'
    epochNumber: bigint
    capabilitiesSummaryHash: H256
    attestationReportHash: H256
}

/**
 * Register an operator. RFC-0003: stake-bound hotkey identity.
 * 
 * Reserves `stake` from the caller's free balance for the lifetime of
 * the registration. The reservation is released on `unregister` and
 * reduced by `slash`.
 */
export interface OperatorStakeCall_register {
    __kind: 'register'
    stake: bigint
    attestationHash: H256
}

/**
 * Slash hook called by `pallet-slashing` after dispute resolution.
 * 
 * Gated by `T::SlashOrigin` (typically `EnsureRoot` in dev / a
 * dedicated slashing-panel origin in production). Burns the slashed
 * amount from the operator's reserved balance.
 */
export interface OperatorStakeCall_slash {
    __kind: 'slash'
    who: AccountId32
    amount: bigint
    reasonCode: number
}

/**
 * Voluntarily unregister. Real version exits via unbonding window.
 * 
 * Releases the previously reserved stake back to the operator's free
 * balance.
 */
export interface OperatorStakeCall_unregister {
    __kind: 'unregister'
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const NonceVaultCall: sts.Type<NonceVaultCall> = sts.closedEnum(() => {
    return  {
        record_nonce: sts.enumStruct({
            nonce: H256,
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type NonceVaultCall = NonceVaultCall_record_nonce

/**
 * Record a customer-nonce. Gated on `GatewayOrigin` so arbitrary
 * signed accounts cannot pre-burn customer nonces.
 */
export interface NonceVaultCall_record_nonce {
    __kind: 'record_nonce'
    nonce: H256
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const ModelRegistryCall: sts.Type<ModelRegistryCall> = sts.closedEnum(() => {
    return  {
        deprecate: sts.enumStruct({
            id: H256,
        }),
        register_adapter: sts.enumStruct({
            id: H256,
            baseModelId: H256,
            manifestHash: H256,
        }),
        register_base_model: sts.enumStruct({
            id: H256,
            manifestHash: H256,
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type ModelRegistryCall = ModelRegistryCall_deprecate | ModelRegistryCall_register_adapter | ModelRegistryCall_register_base_model

/**
 * Mark a base model or adapter as deprecated. Only owner.
 * 
 * Checks both `BaseModels` and `Adapters` maps so a deprecation
 * applies to whichever artifact (if any) the caller owns at this
 * id. Errors with `UnknownModel` if neither exists.
 */
export interface ModelRegistryCall_deprecate {
    __kind: 'deprecate'
    id: H256
}

/**
 * Register a LoRA adapter against an existing base model.
 */
export interface ModelRegistryCall_register_adapter {
    __kind: 'register_adapter'
    id: H256
    baseModelId: H256
    manifestHash: H256
}

/**
 * Register a new base model. The `id` is the content hash of the
 * weight manifest. Off-chain metadata (name / manifest URL) is the
 * caller's responsibility — the chain only stores hashes.
 */
export interface ModelRegistryCall_register_base_model {
    __kind: 'register_base_model'
    id: H256
    manifestHash: H256
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const JobMarketCall: sts.Type<JobMarketCall> = sts.closedEnum(() => {
    return  {
        assign: sts.enumStruct({
            jobId: H256,
            operator: AccountId32,
        }),
        dispute: sts.enumStruct({
            jobId: H256,
        }),
        finalize: sts.enumStruct({
            jobId: H256,
        }),
        submit_job: sts.enumStruct({
            jobId: H256,
            gateway: AccountId32,
            modelId: H256,
            adapterId: sts.option(() => H256),
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type JobMarketCall = JobMarketCall_assign | JobMarketCall_dispute | JobMarketCall_finalize | JobMarketCall_submit_job

/**
 * Assign a job to an operator. Gated on `GatewayOrigin`.
 */
export interface JobMarketCall_assign {
    __kind: 'assign'
    jobId: H256
    operator: AccountId32
}

/**
 * Dispute a job. Only the customer or gateway recorded on the job
 * may dispute, and only while the job is `Submitted` or `Assigned`
 * — once `Finalized` or already `Disputed`, no further transition
 * is permitted.
 */
export interface JobMarketCall_dispute {
    __kind: 'dispute'
    jobId: H256
}

/**
 * Finalize a job. Gated on `GatewayOrigin`.
 */
export interface JobMarketCall_finalize {
    __kind: 'finalize'
    jobId: H256
}

export interface JobMarketCall_submit_job {
    __kind: 'submit_job'
    jobId: H256
    gateway: AccountId32
    modelId: H256
    adapterId?: (H256 | undefined)
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const GrandpaCall: sts.Type<GrandpaCall> = sts.closedEnum(() => {
    return  {
        note_stalled: sts.enumStruct({
            delay: sts.number(),
            bestFinalizedBlockNumber: sts.number(),
        }),
        report_equivocation: sts.enumStruct({
            equivocationProof: EquivocationProof,
            keyOwnerProof: Void,
        }),
        report_equivocation_unsigned: sts.enumStruct({
            equivocationProof: EquivocationProof,
            keyOwnerProof: Void,
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type GrandpaCall = GrandpaCall_note_stalled | GrandpaCall_report_equivocation | GrandpaCall_report_equivocation_unsigned

/**
 * Note that the current authority set of the GRANDPA finality gadget has stalled.
 * 
 * This will trigger a forced authority set change at the beginning of the next session, to
 * be enacted `delay` blocks after that. The `delay` should be high enough to safely assume
 * that the block signalling the forced change will not be re-orged e.g. 1000 blocks.
 * The block production rate (which may be slowed down because of finality lagging) should
 * be taken into account when choosing the `delay`. The GRANDPA voters based on the new
 * authority will start voting on top of `best_finalized_block_number` for new finalized
 * blocks. `best_finalized_block_number` should be the highest of the latest finalized
 * block of all validators of the new authority set.
 * 
 * Only callable by root.
 */
export interface GrandpaCall_note_stalled {
    __kind: 'note_stalled'
    delay: number
    bestFinalizedBlockNumber: number
}

/**
 * Report voter equivocation/misbehavior. This method will verify the
 * equivocation proof and validate the given key ownership proof
 * against the extracted offender. If both are valid, the offence
 * will be reported.
 */
export interface GrandpaCall_report_equivocation {
    __kind: 'report_equivocation'
    equivocationProof: EquivocationProof
    keyOwnerProof: Void
}

/**
 * Report voter equivocation/misbehavior. This method will verify the
 * equivocation proof and validate the given key ownership proof
 * against the extracted offender. If both are valid, the offence
 * will be reported.
 * 
 * This extrinsic must be called unsigned and it is expected that only
 * block authors will call it (validated in `ValidateUnsigned`), as such
 * if the block author is defined it will be defined as the equivocation
 * reporter.
 */
export interface GrandpaCall_report_equivocation_unsigned {
    __kind: 'report_equivocation_unsigned'
    equivocationProof: EquivocationProof
    keyOwnerProof: Void
}

export type Void = never

export interface EquivocationProof {
    setId: bigint
    equivocation: Equivocation
}

export type Equivocation = Equivocation_Precommit | Equivocation_Prevote

export interface Equivocation_Precommit {
    __kind: 'Precommit'
    value: Type_104
}

export interface Equivocation_Prevote {
    __kind: 'Prevote'
    value: Type_99
}

export interface Type_99 {
    roundNumber: bigint
    identity: Public
    first: [Prevote, Signature]
    second: [Prevote, Signature]
}

export type Signature = Bytes

export interface Prevote {
    targetHash: H256
    targetNumber: number
}

export type Public = Bytes

export interface Type_104 {
    roundNumber: bigint
    identity: Public
    first: [Precommit, Signature]
    second: [Precommit, Signature]
}

export interface Precommit {
    targetHash: H256
    targetNumber: number
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const BmeCall: sts.Type<BmeCall> = sts.closedEnum(() => {
    return  {
        mint_to_operator: sts.enumStruct({
            operator: AccountId32,
            amount: sts.bigint(),
        }),
        set_elasticity: sts.enumStruct({
            elasticityBps: sts.number(),
        }),
        submit_burn: sts.enumStruct({
            batchId: H256,
            amount: sts.bigint(),
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type BmeCall = BmeCall_mint_to_operator | BmeCall_set_elasticity | BmeCall_submit_burn

/**
 * Mint OROG to a single operator. In production, called by
 * `pallet-job-market::finalize_batch` after burn verification.
 * 
 * Gated on `MintOrigin`. Uses `checked_mul` for the headroom cap and
 * rejects on overflow instead of saturating to `u128::MAX`.
 */
export interface BmeCall_mint_to_operator {
    __kind: 'mint_to_operator'
    operator: AccountId32
    amount: bigint
}

/**
 * Set elasticity factor (governance hook). Root / governance only.
 */
export interface BmeCall_set_elasticity {
    __kind: 'set_elasticity'
    elasticityBps: number
}

/**
 * Gateway-submitted burn (RFC-0004 §submit_batch step 5).
 * 
 * Gated on `GatewayOrigin` — only verified gateways may extend the
 * network's recorded burn quantity, since this drives the mint
 * headroom.
 */
export interface BmeCall_submit_burn {
    __kind: 'submit_burn'
    batchId: H256
    amount: bigint
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const BalancesCall: sts.Type<BalancesCall> = sts.closedEnum(() => {
    return  {
        burn: sts.enumStruct({
            value: sts.bigint(),
            keepAlive: sts.boolean(),
        }),
        force_adjust_total_issuance: sts.enumStruct({
            direction: AdjustmentDirection,
            delta: sts.bigint(),
        }),
        force_set_balance: sts.enumStruct({
            who: MultiAddress,
            newFree: sts.bigint(),
        }),
        force_transfer: sts.enumStruct({
            source: MultiAddress,
            dest: MultiAddress,
            value: sts.bigint(),
        }),
        force_unreserve: sts.enumStruct({
            who: MultiAddress,
            amount: sts.bigint(),
        }),
        transfer_all: sts.enumStruct({
            dest: MultiAddress,
            keepAlive: sts.boolean(),
        }),
        transfer_allow_death: sts.enumStruct({
            dest: MultiAddress,
            value: sts.bigint(),
        }),
        transfer_keep_alive: sts.enumStruct({
            dest: MultiAddress,
            value: sts.bigint(),
        }),
        upgrade_accounts: sts.enumStruct({
            who: sts.array(() => AccountId32),
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type BalancesCall = BalancesCall_burn | BalancesCall_force_adjust_total_issuance | BalancesCall_force_set_balance | BalancesCall_force_transfer | BalancesCall_force_unreserve | BalancesCall_transfer_all | BalancesCall_transfer_allow_death | BalancesCall_transfer_keep_alive | BalancesCall_upgrade_accounts

/**
 * Burn the specified liquid free balance from the origin account.
 * 
 * If the origin's account ends up below the existential deposit as a result
 * of the burn and `keep_alive` is false, the account will be reaped.
 * 
 * Unlike sending funds to a _burn_ address, which merely makes the funds inaccessible,
 * this `burn` operation will reduce total issuance by the amount _burned_.
 */
export interface BalancesCall_burn {
    __kind: 'burn'
    value: bigint
    keepAlive: boolean
}

/**
 * Adjust the total issuance in a saturating way.
 * 
 * Can only be called by root and always needs a positive `delta`.
 * 
 * # Example
 */
export interface BalancesCall_force_adjust_total_issuance {
    __kind: 'force_adjust_total_issuance'
    direction: AdjustmentDirection
    delta: bigint
}

/**
 * Set the regular balance of a given account.
 * 
 * The dispatch origin for this call is `root`.
 */
export interface BalancesCall_force_set_balance {
    __kind: 'force_set_balance'
    who: MultiAddress
    newFree: bigint
}

/**
 * Exactly as `transfer_allow_death`, except the origin must be root and the source account
 * may be specified.
 */
export interface BalancesCall_force_transfer {
    __kind: 'force_transfer'
    source: MultiAddress
    dest: MultiAddress
    value: bigint
}

/**
 * Unreserve some balance from a user by force.
 * 
 * Can only be called by ROOT.
 */
export interface BalancesCall_force_unreserve {
    __kind: 'force_unreserve'
    who: MultiAddress
    amount: bigint
}

/**
 * Transfer the entire transferable balance from the caller account.
 * 
 * NOTE: This function only attempts to transfer _transferable_ balances. This means that
 * any locked, reserved, or existential deposits (when `keep_alive` is `true`), will not be
 * transferred by this function. To ensure that this function results in a killed account,
 * you might need to prepare the account by removing any reference counters, storage
 * deposits, etc...
 * 
 * The dispatch origin of this call must be Signed.
 * 
 * - `dest`: The recipient of the transfer.
 * - `keep_alive`: A boolean to determine if the `transfer_all` operation should send all
 *   of the funds the account has, causing the sender account to be killed (false), or
 *   transfer everything except at least the existential deposit, which will guarantee to
 *   keep the sender account alive (true).
 */
export interface BalancesCall_transfer_all {
    __kind: 'transfer_all'
    dest: MultiAddress
    keepAlive: boolean
}

/**
 * Transfer some liquid free balance to another account.
 * 
 * `transfer_allow_death` will set the `FreeBalance` of the sender and receiver.
 * If the sender's account is below the existential deposit as a result
 * of the transfer, the account will be reaped.
 * 
 * The dispatch origin for this call must be `Signed` by the transactor.
 */
export interface BalancesCall_transfer_allow_death {
    __kind: 'transfer_allow_death'
    dest: MultiAddress
    value: bigint
}

/**
 * Same as the [`transfer_allow_death`] call, but with a check that the transfer will not
 * kill the origin account.
 * 
 * 99% of the time you want [`transfer_allow_death`] instead.
 * 
 * [`transfer_allow_death`]: struct.Pallet.html#method.transfer
 */
export interface BalancesCall_transfer_keep_alive {
    __kind: 'transfer_keep_alive'
    dest: MultiAddress
    value: bigint
}

/**
 * Upgrade a specified account.
 * 
 * - `origin`: Must be `Signed`.
 * - `who`: The account to be upgraded.
 * 
 * This will waive the transaction fee if at least all but 10% of the accounts needed to
 * be upgraded. (We let some not have to be upgraded just in order to allow for the
 * possibility of churn).
 */
export interface BalancesCall_upgrade_accounts {
    __kind: 'upgrade_accounts'
    who: AccountId32[]
}

export type AdjustmentDirection = AdjustmentDirection_Decrease | AdjustmentDirection_Increase

export interface AdjustmentDirection_Decrease {
    __kind: 'Decrease'
}

export interface AdjustmentDirection_Increase {
    __kind: 'Increase'
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const AttestationRegistryCall: sts.Type<AttestationRegistryCall> = sts.closedEnum(() => {
    return  {
        add_to_crl: sts.enumStruct({
            kind: CrlKind,
            target: H256,
        }),
        revoke: sts.enumStruct({
            reportHash: H256,
        }),
        submit: sts.enumStruct({
            reportHash: H256,
            gpuUuid: H256,
            vendorSet: sts.number(),
            measuredVmBundle: H256,
            expiresAt: sts.number(),
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type AttestationRegistryCall = AttestationRegistryCall_add_to_crl | AttestationRegistryCall_revoke | AttestationRegistryCall_submit

/**
 * Add an entry to the certificate revocation list. Admin-gated.
 */
export interface AttestationRegistryCall_add_to_crl {
    __kind: 'add_to_crl'
    kind: CrlKind
    target: H256
}

/**
 * Revoke a previously-submitted attestation. Admin-gated.
 */
export interface AttestationRegistryCall_revoke {
    __kind: 'revoke'
    reportHash: H256
}

export interface AttestationRegistryCall_submit {
    __kind: 'submit'
    reportHash: H256
    gpuUuid: H256
    vendorSet: number
    measuredVmBundle: H256
    expiresAt: number
}

export type CrlKind = CrlKind_DeviceCert | CrlKind_FirmwareHash | CrlKind_ModelHash | CrlKind_VendorPkiChain

export interface CrlKind_DeviceCert {
    __kind: 'DeviceCert'
}

export interface CrlKind_FirmwareHash {
    __kind: 'FirmwareHash'
}

export interface CrlKind_ModelHash {
    __kind: 'ModelHash'
}

export interface CrlKind_VendorPkiChain {
    __kind: 'VendorPkiChain'
}

export type Call = Call_AttestationRegistry | Call_Balances | Call_Bme | Call_Grandpa | Call_JobMarket | Call_ModelRegistry | Call_NonceVault | Call_OperatorStake | Call_OracleTwap | Call_PouwMint | Call_Slashing | Call_Sudo | Call_System | Call_Timestamp | Call_TreasuryExt | Call_YumaConsensus

export interface Call_AttestationRegistry {
    __kind: 'AttestationRegistry'
    value: AttestationRegistryCall
}

export interface Call_Balances {
    __kind: 'Balances'
    value: BalancesCall
}

export interface Call_Bme {
    __kind: 'Bme'
    value: BmeCall
}

export interface Call_Grandpa {
    __kind: 'Grandpa'
    value: GrandpaCall
}

export interface Call_JobMarket {
    __kind: 'JobMarket'
    value: JobMarketCall
}

export interface Call_ModelRegistry {
    __kind: 'ModelRegistry'
    value: ModelRegistryCall
}

export interface Call_NonceVault {
    __kind: 'NonceVault'
    value: NonceVaultCall
}

export interface Call_OperatorStake {
    __kind: 'OperatorStake'
    value: OperatorStakeCall
}

export interface Call_OracleTwap {
    __kind: 'OracleTwap'
    value: OracleTwapCall
}

export interface Call_PouwMint {
    __kind: 'PouwMint'
    value: PouwMintCall
}

export interface Call_Slashing {
    __kind: 'Slashing'
    value: SlashingCall
}

export interface Call_Sudo {
    __kind: 'Sudo'
    value: SudoCall
}

export interface Call_System {
    __kind: 'System'
    value: SystemCall
}

export interface Call_Timestamp {
    __kind: 'Timestamp'
    value: TimestampCall
}

export interface Call_TreasuryExt {
    __kind: 'TreasuryExt'
    value: TreasuryExtCall
}

export interface Call_YumaConsensus {
    __kind: 'YumaConsensus'
    value: YumaConsensusCall
}

export const AdjustmentDirection: sts.Type<AdjustmentDirection> = sts.closedEnum(() => {
    return  {
        Decrease: sts.unit(),
        Increase: sts.unit(),
    }
})

export const MultiAddress: sts.Type<MultiAddress> = sts.closedEnum(() => {
    return  {
        Address20: sts.bytes(),
        Address32: sts.bytes(),
        Id: AccountId32,
        Index: sts.unit(),
        Raw: sts.bytes(),
    }
})

export const Void: sts.Type<Void> = sts.closedEnum(() => {
    return  {
    }
})

export const EquivocationProof: sts.Type<EquivocationProof> = sts.struct(() => {
    return  {
        setId: sts.bigint(),
        equivocation: Equivocation,
    }
})

export const Equivocation: sts.Type<Equivocation> = sts.closedEnum(() => {
    return  {
        Precommit: Type_104,
        Prevote: Type_99,
    }
})

export const Type_99: sts.Type<Type_99> = sts.struct(() => {
    return  {
        roundNumber: sts.bigint(),
        identity: Public,
        first: sts.tuple(() => [Prevote, Signature]),
        second: sts.tuple(() => [Prevote, Signature]),
    }
})

export const Signature = sts.bytes()

export const Prevote: sts.Type<Prevote> = sts.struct(() => {
    return  {
        targetHash: H256,
        targetNumber: sts.number(),
    }
})

export const Type_104: sts.Type<Type_104> = sts.struct(() => {
    return  {
        roundNumber: sts.bigint(),
        identity: Public,
        first: sts.tuple(() => [Precommit, Signature]),
        second: sts.tuple(() => [Precommit, Signature]),
    }
})

export const Precommit: sts.Type<Precommit> = sts.struct(() => {
    return  {
        targetHash: H256,
        targetNumber: sts.number(),
    }
})

export const CrlKind: sts.Type<CrlKind> = sts.closedEnum(() => {
    return  {
        DeviceCert: sts.unit(),
        FirmwareHash: sts.unit(),
        ModelHash: sts.unit(),
        VendorPkiChain: sts.unit(),
    }
})

export const MultisigDecision: sts.Type<MultisigDecision> = sts.closedEnum(() => {
    return  {
        Overturn: sts.unit(),
        Uphold: sts.unit(),
    }
})

export const ArbitrationVote: sts.Type<ArbitrationVote> = sts.closedEnum(() => {
    return  {
        Insufficient: sts.unit(),
        Overturn: sts.unit(),
        Uphold: sts.unit(),
    }
})

export const FaultCode: sts.Type<FaultCode> = sts.closedEnum(() => {
    return  {
        AttestationStale: sts.unit(),
        BatchOvercommit: sts.unit(),
        CacheReplay: sts.unit(),
        DeviceCertCollision: sts.unit(),
        FakeBurn: sts.unit(),
        HeartbeatMiss: sts.unit(),
        KernelPackMismatch: sts.unit(),
        LogProbDrift: sts.unit(),
        QuantizationSwap: sts.unit(),
        SanctionsHit: sts.unit(),
        ValidatorCollusion: sts.unit(),
        WrongModel: sts.unit(),
        WrongResponse: sts.unit(),
    }
})

export const UnexpectedKind: sts.Type<UnexpectedKind> = sts.closedEnum(() => {
    return  {
        BalanceUpdated: sts.unit(),
        FailedToMutateAccount: sts.unit(),
    }
})

export type UnexpectedKind = UnexpectedKind_BalanceUpdated | UnexpectedKind_FailedToMutateAccount

export interface UnexpectedKind_BalanceUpdated {
    __kind: 'BalanceUpdated'
}

export interface UnexpectedKind_FailedToMutateAccount {
    __kind: 'FailedToMutateAccount'
}

export const RuntimeHoldReason: sts.Type<RuntimeHoldReason> = sts.closedEnum(() => {
    return  {
    }
})

export type RuntimeHoldReason = never

export const BalanceStatus: sts.Type<BalanceStatus> = sts.closedEnum(() => {
    return  {
        Free: sts.unit(),
        Reserved: sts.unit(),
    }
})

export type BalanceStatus = BalanceStatus_Free | BalanceStatus_Reserved

export interface BalanceStatus_Free {
    __kind: 'Free'
}

export interface BalanceStatus_Reserved {
    __kind: 'Reserved'
}

export const Public = sts.bytes()

export const AccountId32 = sts.bytes()

export const H256 = sts.bytes()

export const DispatchError: sts.Type<DispatchError> = sts.closedEnum(() => {
    return  {
        Arithmetic: ArithmeticError,
        BadOrigin: sts.unit(),
        CannotLookup: sts.unit(),
        ConsumerRemaining: sts.unit(),
        Corruption: sts.unit(),
        Exhausted: sts.unit(),
        Module: ModuleError,
        NoProviders: sts.unit(),
        Other: sts.unit(),
        RootNotAllowed: sts.unit(),
        Token: TokenError,
        TooManyConsumers: sts.unit(),
        Transactional: TransactionalError,
        Trie: TrieError,
        Unavailable: sts.unit(),
    }
})

export const TrieError: sts.Type<TrieError> = sts.closedEnum(() => {
    return  {
        DecodeError: sts.unit(),
        DecoderError: sts.unit(),
        DuplicateKey: sts.unit(),
        ExtraneousHashReference: sts.unit(),
        ExtraneousNode: sts.unit(),
        ExtraneousValue: sts.unit(),
        IncompleteDatabase: sts.unit(),
        IncompleteProof: sts.unit(),
        InvalidChildReference: sts.unit(),
        InvalidHash: sts.unit(),
        InvalidStateRoot: sts.unit(),
        RootMismatch: sts.unit(),
        ValueAtIncompleteKey: sts.unit(),
        ValueMismatch: sts.unit(),
    }
})

export type TrieError = TrieError_DecodeError | TrieError_DecoderError | TrieError_DuplicateKey | TrieError_ExtraneousHashReference | TrieError_ExtraneousNode | TrieError_ExtraneousValue | TrieError_IncompleteDatabase | TrieError_IncompleteProof | TrieError_InvalidChildReference | TrieError_InvalidHash | TrieError_InvalidStateRoot | TrieError_RootMismatch | TrieError_ValueAtIncompleteKey | TrieError_ValueMismatch

export interface TrieError_DecodeError {
    __kind: 'DecodeError'
}

export interface TrieError_DecoderError {
    __kind: 'DecoderError'
}

export interface TrieError_DuplicateKey {
    __kind: 'DuplicateKey'
}

export interface TrieError_ExtraneousHashReference {
    __kind: 'ExtraneousHashReference'
}

export interface TrieError_ExtraneousNode {
    __kind: 'ExtraneousNode'
}

export interface TrieError_ExtraneousValue {
    __kind: 'ExtraneousValue'
}

export interface TrieError_IncompleteDatabase {
    __kind: 'IncompleteDatabase'
}

export interface TrieError_IncompleteProof {
    __kind: 'IncompleteProof'
}

export interface TrieError_InvalidChildReference {
    __kind: 'InvalidChildReference'
}

export interface TrieError_InvalidHash {
    __kind: 'InvalidHash'
}

export interface TrieError_InvalidStateRoot {
    __kind: 'InvalidStateRoot'
}

export interface TrieError_RootMismatch {
    __kind: 'RootMismatch'
}

export interface TrieError_ValueAtIncompleteKey {
    __kind: 'ValueAtIncompleteKey'
}

export interface TrieError_ValueMismatch {
    __kind: 'ValueMismatch'
}

export const TransactionalError: sts.Type<TransactionalError> = sts.closedEnum(() => {
    return  {
        LimitReached: sts.unit(),
        NoLayer: sts.unit(),
    }
})

export type TransactionalError = TransactionalError_LimitReached | TransactionalError_NoLayer

export interface TransactionalError_LimitReached {
    __kind: 'LimitReached'
}

export interface TransactionalError_NoLayer {
    __kind: 'NoLayer'
}

export const TokenError: sts.Type<TokenError> = sts.closedEnum(() => {
    return  {
        BelowMinimum: sts.unit(),
        Blocked: sts.unit(),
        CannotCreate: sts.unit(),
        CannotCreateHold: sts.unit(),
        Frozen: sts.unit(),
        FundsUnavailable: sts.unit(),
        NotExpendable: sts.unit(),
        OnlyProvider: sts.unit(),
        UnknownAsset: sts.unit(),
        Unsupported: sts.unit(),
    }
})

export type TokenError = TokenError_BelowMinimum | TokenError_Blocked | TokenError_CannotCreate | TokenError_CannotCreateHold | TokenError_Frozen | TokenError_FundsUnavailable | TokenError_NotExpendable | TokenError_OnlyProvider | TokenError_UnknownAsset | TokenError_Unsupported

export interface TokenError_BelowMinimum {
    __kind: 'BelowMinimum'
}

export interface TokenError_Blocked {
    __kind: 'Blocked'
}

export interface TokenError_CannotCreate {
    __kind: 'CannotCreate'
}

export interface TokenError_CannotCreateHold {
    __kind: 'CannotCreateHold'
}

export interface TokenError_Frozen {
    __kind: 'Frozen'
}

export interface TokenError_FundsUnavailable {
    __kind: 'FundsUnavailable'
}

export interface TokenError_NotExpendable {
    __kind: 'NotExpendable'
}

export interface TokenError_OnlyProvider {
    __kind: 'OnlyProvider'
}

export interface TokenError_UnknownAsset {
    __kind: 'UnknownAsset'
}

export interface TokenError_Unsupported {
    __kind: 'Unsupported'
}

export const ModuleError: sts.Type<ModuleError> = sts.struct(() => {
    return  {
        index: sts.number(),
        error: sts.bytes(),
    }
})

export interface ModuleError {
    index: number
    error: Bytes
}

export const ArithmeticError: sts.Type<ArithmeticError> = sts.closedEnum(() => {
    return  {
        DivisionByZero: sts.unit(),
        Overflow: sts.unit(),
        Underflow: sts.unit(),
    }
})

export type ArithmeticError = ArithmeticError_DivisionByZero | ArithmeticError_Overflow | ArithmeticError_Underflow

export interface ArithmeticError_DivisionByZero {
    __kind: 'DivisionByZero'
}

export interface ArithmeticError_Overflow {
    __kind: 'Overflow'
}

export interface ArithmeticError_Underflow {
    __kind: 'Underflow'
}

export type DispatchError = DispatchError_Arithmetic | DispatchError_BadOrigin | DispatchError_CannotLookup | DispatchError_ConsumerRemaining | DispatchError_Corruption | DispatchError_Exhausted | DispatchError_Module | DispatchError_NoProviders | DispatchError_Other | DispatchError_RootNotAllowed | DispatchError_Token | DispatchError_TooManyConsumers | DispatchError_Transactional | DispatchError_Trie | DispatchError_Unavailable

export interface DispatchError_Arithmetic {
    __kind: 'Arithmetic'
    value: ArithmeticError
}

export interface DispatchError_BadOrigin {
    __kind: 'BadOrigin'
}

export interface DispatchError_CannotLookup {
    __kind: 'CannotLookup'
}

export interface DispatchError_ConsumerRemaining {
    __kind: 'ConsumerRemaining'
}

export interface DispatchError_Corruption {
    __kind: 'Corruption'
}

export interface DispatchError_Exhausted {
    __kind: 'Exhausted'
}

export interface DispatchError_Module {
    __kind: 'Module'
    value: ModuleError
}

export interface DispatchError_NoProviders {
    __kind: 'NoProviders'
}

export interface DispatchError_Other {
    __kind: 'Other'
}

export interface DispatchError_RootNotAllowed {
    __kind: 'RootNotAllowed'
}

export interface DispatchError_Token {
    __kind: 'Token'
    value: TokenError
}

export interface DispatchError_TooManyConsumers {
    __kind: 'TooManyConsumers'
}

export interface DispatchError_Transactional {
    __kind: 'Transactional'
    value: TransactionalError
}

export interface DispatchError_Trie {
    __kind: 'Trie'
    value: TrieError
}

export interface DispatchError_Unavailable {
    __kind: 'Unavailable'
}

export const DispatchEventInfo: sts.Type<DispatchEventInfo> = sts.struct(() => {
    return  {
        weight: Weight,
        class: DispatchClass,
        paysFee: Pays,
    }
})

export const Pays: sts.Type<Pays> = sts.closedEnum(() => {
    return  {
        No: sts.unit(),
        Yes: sts.unit(),
    }
})

export type Pays = Pays_No | Pays_Yes

export interface Pays_No {
    __kind: 'No'
}

export interface Pays_Yes {
    __kind: 'Yes'
}

export const DispatchClass: sts.Type<DispatchClass> = sts.closedEnum(() => {
    return  {
        Mandatory: sts.unit(),
        Normal: sts.unit(),
        Operational: sts.unit(),
    }
})

export type DispatchClass = DispatchClass_Mandatory | DispatchClass_Normal | DispatchClass_Operational

export interface DispatchClass_Mandatory {
    __kind: 'Mandatory'
}

export interface DispatchClass_Normal {
    __kind: 'Normal'
}

export interface DispatchClass_Operational {
    __kind: 'Operational'
}

export interface DispatchEventInfo {
    weight: Weight
    class: DispatchClass
    paysFee: Pays
}
