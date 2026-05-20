/**
 * Handler-facing codec types for pallet events.
 *
 * `npm run codegen:types` emits metadata-backed event/call accessors under
 * `src/types/generated/`. Handlers use `decodeEvent()`, which prefers the
 * generated accessor when Subsquid attaches runtime metadata to an event and
 * falls back to `event.args` for local fixtures that lack runtime context.
 */
import * as generatedBmeEvents from './generated/bme/events.js';
import * as generatedJobMarketEvents from './generated/job-market/events.js';
import * as generatedOperatorStakeEvents from './generated/operator-stake/events.js';
import * as generatedSlashingEvents from './generated/slashing/events.js';

// --- pallet-job-market --------------------------------------------------------
export interface JobSubmittedEvent {
    jobId?: string; // 32-byte hex
    job_id?: string;
    customer: string; // ss58
    modelId?: string;
    model_id?: string;
    adapterId?: string | null;
    adapter_id?: string | null;
    submittedAt?: number;
    submitted_at?: number;
}

export interface JobAssignedEvent {
    jobId?: string;
    job_id?: string;
    operator: string;
}

export interface JobFinalizedEvent {
    jobId?: string;
    job_id?: string;
    receiptRoot?: string | null;
    receipt_root?: string | null;
    costMicroUSD?: bigint | null;
    cost_micro_usd?: bigint | null;
    finalizedAt?: number;
    finalized_at?: number;
}

export interface JobDisputedEvent {
    jobId?: string;
    job_id?: string;
    disputant?: string;
    evidenceCid?: string;
    evidence_cid?: string;
}

// --- pallet-bme ---------------------------------------------------------------
export interface BurnSubmittedEvent {
    amount: bigint;
    batchId?: string;
    batch_id?: string;
}

export interface MintedEvent {
    operator: string;
    amount: bigint;
}

// --- pallet-slashing ----------------------------------------------------------
export interface SlashSubmittedEvent {
    slashId?: number | bigint;
    slash_id?: number | bigint;
    operator: string;
    faultCode?: string;
    fault_code?: string;
}

export interface SlashDisputedEvent {
    slashId?: number | bigint;
    slash_id?: number | bigint;
}

export interface SlashRatifiedEvent {
    slashId?: number | bigint;
    slash_id?: number | bigint;
    decision: unknown;
}

export interface SlashFinalizedEvent {
    slashId?: number | bigint;
    slash_id?: number | bigint;
}

// --- pallet-operator-stake ----------------------------------------------------
export interface RegisteredEvent {
    operator?: string;
    who?: string;
    stake: bigint;
    attestationCid?: string | null;
    attestation_cid?: string | null;
}

export interface UnregisteredEvent {
    operator?: string;
    who?: string;
}

export interface HeartbeatEvent {
    operator?: string;
    who?: string;
    height?: number;
    epoch?: number | bigint;
}

export interface OperatorSlashedEvent {
    operator?: string;
    who?: string;
    amount: bigint;
    reasonCode?: number;
    reason_code?: number;
}

type GeneratedEventAccessor = {
    name: string;
} & Record<`v${number}`, {
        is: (event: any) => boolean;
        decode: (event: any) => unknown;
    }>;

type DecodableEvent = {
    name: string;
    args: unknown;
};

type RuntimeEvent = DecodableEvent & {
    block: {
        _runtime: {
            specVersion?: number;
        };
    };
};

const GENERATED_EVENT_ACCESSORS = new Map<string, GeneratedEventAccessor>(
    [
        generatedJobMarketEvents.jobSubmitted,
        generatedJobMarketEvents.jobAssigned,
        generatedJobMarketEvents.jobFinalized,
        generatedJobMarketEvents.jobDisputed,
        generatedBmeEvents.burnSubmitted,
        generatedBmeEvents.minted,
        generatedBmeEvents.elasticitySet,
        generatedSlashingEvents.slashSubmitted,
        generatedSlashingEvents.slashDisputed,
        generatedSlashingEvents.slashArbitrated,
        generatedSlashingEvents.slashRatified,
        generatedSlashingEvents.slashFinalized,
        generatedOperatorStakeEvents.registered,
        generatedOperatorStakeEvents.unregistered,
        generatedOperatorStakeEvents.heartbeat,
        generatedOperatorStakeEvents.slashed,
    ].map((accessor) => [accessor.name, accessor]),
);

export function generatedEventNames(): string[] {
    return [...GENERATED_EVENT_ACCESSORS.keys()];
}

/**
 * Decode a runtime event for handlers.
 *
 * In live Subsquid processing, events can carry a runtime context that lets
 * generated accessors validate and decode against metadata. Unit fixtures and
 * old JSON shapes lack that context, so those deliberately fall back to the
 * raw args object.
 */
export function decodeEvent<T>(event: DecodableEvent): T {
    const accessor = GENERATED_EVENT_ACCESSORS.get(event.name);
    if (accessor && hasRuntimeContext(event)) {
        const versionedAccessor = runtimeVersionAccessor(accessor, event);
        if (!versionedAccessor) {
            const specVersion = event.block._runtime.specVersion;
            throw new Error(
                `chain-indexer: generated metadata decoder for ${event.name} does not include runtime specVersion v${specVersion}`,
            );
        }
        if (versionedAccessor.is(event)) {
            return versionedAccessor.decode(event) as T;
        }
        throw new Error(`chain-indexer: generated metadata decoder does not match ${event.name}`);
    }
    if (accessor && process.env.OROGEN_ENV === 'production') {
        throw new Error(`chain-indexer: refusing raw event args fallback for ${event.name} in production`);
    }
    return event.args as T;
}

function hasRuntimeContext(event: DecodableEvent): event is RuntimeEvent {
    const candidate = event as DecodableEvent & { block?: { _runtime?: unknown } };
    return candidate.block?._runtime !== undefined;
}

function runtimeVersionAccessor(accessor: GeneratedEventAccessor, event: RuntimeEvent) {
    const specVersion = event.block._runtime.specVersion;
    if (typeof specVersion !== 'number') {
        throw new Error(`chain-indexer: runtime context for ${event.name} is missing specVersion`);
    }
    return accessor[`v${specVersion}`];
}
