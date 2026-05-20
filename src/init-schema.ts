/**
 * Development-only schema initializer. Creates all entity tables via
 * TypeORM's `synchronize()` and seeds the @subsquid/typeorm-store status row.
 *
 * Runs once at install time (`npm run db:init` after `npm run build`).
 * Idempotent: re-running is a no-op once the schema exists.
 *
 * Release deployments must use generated migrations instead. This script
 * refuses to run unless CHAIN_INDEXER_ALLOW_SCHEMA_SYNC=true and
 * OROGEN_ENV is not production.
 */
import 'reflect-metadata';

import { config } from './config.js';
import { createDataSource, ENTITIES } from './db.js';

async function main(): Promise<void> {
    if (!config.allowSchemaSync || config.orogenEnv === 'production') {
        throw new Error(
            'Refusing TypeORM synchronize. Set CHAIN_INDEXER_ALLOW_SCHEMA_SYNC=true only for local/dev databases; release deployments must use migrations.',
        );
    }
    const ds = createDataSource({ synchronize: config.allowSchemaSync });
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
