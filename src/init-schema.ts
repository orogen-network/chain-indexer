/**
 * One-shot schema initializer. Creates all entity tables via TypeORM's
 * `synchronize()` and seeds the @subsquid/typeorm-store status row.
 *
 * Runs once at install time (`npm run db:init` after `npm run build`).
 * Idempotent: re-running is a no-op once the schema exists.
 *
 * This replaces the canonical `squid-typeorm-migration generate/apply`
 * workflow with a synchronize-on-install approach, which is fine for the
 * skeleton-pallet forge testnet where data has no archival value yet.
 * When pallets emit real events and we care about migration history,
 * switch to generated migrations.
 */
import 'reflect-metadata';
import { DataSource } from 'typeorm';

// Subsquid's typeorm-store always queries with a SnakeNamingStrategy
// (parentHash → parent_hash). We must create the schema with the same
// naming strategy so the runtime queries match the actual column names.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — type-only import from a runtime-only path
import { SnakeNamingStrategy } from '@subsquid/typeorm-config/lib/namingStrategy.js';

import { config } from './config.js';
import {
    AttestationRecord,
    Block,
    BurnEvent,
    DisputeEvent,
    Event,
    Extrinsic,
    Job,
    MintEvent,
    Operator,
    SlashEvent,
    TwapUpdate,
} from './model/index.js';

const ENTITIES = [
    Block,
    Extrinsic,
    Event,
    Operator,
    Job,
    BurnEvent,
    MintEvent,
    SlashEvent,
    DisputeEvent,
    AttestationRecord,
    TwapUpdate,
];

async function main(): Promise<void> {
    const ds = new DataSource({
        type: 'postgres',
        host: config.db.host,
        port: config.db.port,
        username: config.db.user,
        password: config.db.pass,
        database: config.db.name,
        entities: ENTITIES,
        synchronize: true,
        namingStrategy: new SnakeNamingStrategy(),
        logging: ['error', 'warn'],
    });
    await ds.initialize();

    // @subsquid/typeorm-store reads/writes `squid_processor.status` to
    // track the last finalized + last-processed height. Create the schema
    // and a single status row if missing so the processor can start cold
    // without a migration framework underneath us.
    await ds.query('CREATE SCHEMA IF NOT EXISTS squid_processor');
    await ds.query(`
        CREATE TABLE IF NOT EXISTS squid_processor.status (
            id integer PRIMARY KEY,
            height integer NOT NULL,
            hash text NOT NULL,
            nonce integer NOT NULL
        )
    `);
    await ds.query(`
        INSERT INTO squid_processor.status (id, height, hash, nonce)
        VALUES (0, -1, '0x', 0)
        ON CONFLICT (id) DO NOTHING
    `);

    // eslint-disable-next-line no-console
    console.log(
        `chain-indexer: schema synced (${ENTITIES.length} entities) + status seeded`,
    );
    await ds.destroy();
}

main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error('init-schema: fatal:', err);
    process.exit(1);
});
