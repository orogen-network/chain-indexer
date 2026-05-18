/**
 * Shared FieldSelection and Ctx aliases. Centralizing this here means
 * handler files can stay agnostic of the exact field-selection shape — the
 * single source of truth lives in `main.ts` and is mirrored by `FIELDS`
 * below for type purposes.
 */
import type { DataHandlerContext, FieldSelection } from '@subsquid/substrate-processor';
import type { Store } from '@subsquid/typeorm-store';

/**
 * The field selection passed to `SubstrateBatchProcessor.setFields()`.
 *
 * Must stay in sync with the literal in `main.ts::buildProcessor`. Marked
 * `as const satisfies FieldSelection` so it's an exact-type literal usable
 * as a generic parameter.
 */
export const FIELDS = {
    // `height`, `hash`, `parentHash`, `specName`, `specVersion`, `implName`,
    // `implVersion` are always present (BlockRequiredFields) and not listed
    // here.
    block: {
        timestamp: true,
        stateRoot: true,
        extrinsicsRoot: true,
        validator: true,
    },
    // `index` is always present.
    extrinsic: {
        hash: true,
        fee: true,
        tip: true,
        success: true,
        signature: true,
    },
    // `index` / `extrinsicIndex` / `callAddress` are always present.
    event: {
        name: true,
        args: true,
    },
} as const satisfies FieldSelection;

export type Fields = typeof FIELDS;

export type Ctx = DataHandlerContext<Store, Fields>;
export type IndexerBlock = Ctx['blocks'][number];
export type IndexerEvent = IndexerBlock['events'][number];
