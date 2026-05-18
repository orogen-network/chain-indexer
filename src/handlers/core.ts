/**
 * Block / extrinsic / event capture. Runs unconditionally per block; the
 * pallet-specific handlers extend these rows with domain models.
 */
import type { Ctx, IndexerBlock } from '../types/context.js';
import { Block, Event, Extrinsic } from '../model/index.js';

export async function recordBlockAndExtrinsics(ctx: Ctx, block: IndexerBlock): Promise<void> {
    const header = block.header;
    const blockEntity = new Block({
        id: header.hash,
        height: header.height,
        hash: header.hash,
        parentHash: header.parentHash,
        timestamp: new Date(header.timestamp ?? 0),
        stateRoot: header.stateRoot ?? '',
        extrinsicsRoot: header.extrinsicsRoot ?? '',
        validator: header.validator ?? null,
        specName: header.specName ?? '',
        specVersion: header.specVersion ?? 0,
    });
    await ctx.store.upsert(blockEntity);

    const extrinsics: Extrinsic[] = [];
    for (const ext of block.extrinsics) {
        const [palletName, callName] = splitName(ext.call?.name ?? 'unknown.unknown');
        extrinsics.push(
            new Extrinsic({
                id: `${header.hash}-${ext.index}`,
                block: blockEntity,
                indexInBlock: ext.index,
                pallet: palletName,
                name: callName,
                signer: extractSigner(ext.signature),
                success: ext.success ?? false,
                tip: ext.tip ?? null,
                fee: ext.fee ?? null,
                hash: ext.hash ?? '',
                args: ext.call?.args ?? null,
            }),
        );
    }
    if (extrinsics.length > 0) await ctx.store.upsert(extrinsics);

    const events: Event[] = [];
    for (const ev of block.events) {
        const [palletName, eventName] = splitName(ev.name);
        const owningExt =
            ev.extrinsic !== undefined
                ? extrinsics.find((e) => e.indexInBlock === ev.extrinsic?.index) ?? null
                : null;
        events.push(
            new Event({
                id: `${header.hash}-${ev.index}`,
                block: blockEntity,
                extrinsic: owningExt,
                indexInBlock: ev.index,
                pallet: palletName,
                name: eventName,
                args: ev.args ?? null,
            }),
        );
    }
    if (events.length > 0) await ctx.store.upsert(events);
}

function splitName(qualified: string): [string, string] {
    const idx = qualified.indexOf('.');
    if (idx === -1) return ['unknown', qualified];
    return [qualified.slice(0, idx), qualified.slice(idx + 1)];
}

function extractSigner(sig: unknown): string | null {
    if (!sig || typeof sig !== 'object') return null;
    const a = (sig as { address?: unknown }).address;
    if (typeof a === 'string') return a;
    if (a && typeof a === 'object' && '__kind' in a && 'value' in a) {
        const v = (a as { value: unknown }).value;
        return typeof v === 'string' ? v : null;
    }
    return null;
}
