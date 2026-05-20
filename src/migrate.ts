import { createDataSource } from './db.js';

async function main(): Promise<void> {
    const ds = createDataSource({ synchronize: false });
    await ds.initialize();
    try {
        const migrations = await ds.runMigrations({ transaction: 'all' });
        // eslint-disable-next-line no-console
        console.log(`chain-indexer: applied ${migrations.length} migration(s)`);
    } finally {
        await ds.destroy();
    }
}

main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error('migrate: fatal:', err);
    process.exit(1);
});
