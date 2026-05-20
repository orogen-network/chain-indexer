import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support.js'
import * as v6 from '../v6.js'

export const submitSlashingEvidence =  {
    name: 'Slashing.submit_slashing_evidence',
    /**
     * Submit verified slashing evidence. Gated on `EvidenceOrigin` so
     * that arbitrary signed accounts cannot open spurious slashes.
     */
    v6: new CallType(
        'Slashing.submit_slashing_evidence',
        sts.struct({
            operator: v6.AccountId32,
            faultCode: v6.FaultCode,
            evidenceHash: v6.H256,
        })
    ),
}

export const disputeSlashing =  {
    name: 'Slashing.dispute_slashing',
    /**
     * Dispute a pending slash. Open to the signed operator under fire
     * (caller-identity check is deferred — the panel decides on merits).
     */
    v6: new CallType(
        'Slashing.dispute_slashing',
        sts.struct({
            slashId: sts.bigint(),
            counterEvidenceHash: v6.H256,
        })
    ),
}

export const arbitrateDispute =  {
    name: 'Slashing.arbitrate_dispute',
    /**
     * Record an arbiter's vote. Gated on `PanelOrigin`. Once the panel
     * has voted, anyone in the panel calling this advances the state to
     * `Arbitrated`. Real quorum check is deferred; for now any single
     * `PanelOrigin` call advances the state and the votes are recorded.
     */
    v6: new CallType(
        'Slashing.arbitrate_dispute',
        sts.struct({
            slashId: sts.bigint(),
            vote: v6.ArbitrationVote,
        })
    ),
}

export const ratifyDispute =  {
    name: 'Slashing.ratify_dispute',
    /**
     * Ratify an arbitrated dispute. Gated on `PanelOrigin`.
     */
    v6: new CallType(
        'Slashing.ratify_dispute',
        sts.struct({
            slashId: sts.bigint(),
            decision: v6.MultisigDecision,
        })
    ),
}

export const finalizeSlash =  {
    name: 'Slashing.finalize_slash',
    /**
     * Move a `Pending` slash that was not disputed inside the window to
     * `Finalized`. Gated on `PanelOrigin` (root or scheduler).
     */
    v6: new CallType(
        'Slashing.finalize_slash',
        sts.struct({
            slashId: sts.bigint(),
        })
    ),
}
