/**
 * Runtime configuration loaded from process.env. Defaults make `main.ts`
 * usable against a local `chain-node --dev` without any env setup.
 */
export interface IndexerConfig {
    rpcEndpoint: string;
    archiveGateway: string | undefined;
    startBlock: number;
    stopBlock: number | undefined;
    graphqlPort: number;
    allowSchemaSync: boolean;
    orogenEnv: string;
    db: {
        host: string;
        port: number;
        user: string;
        pass: string;
        name: string;
    };
}

function num(name: string, defaultValue: number | undefined): number | undefined {
    const v = process.env[name];
    if (v === undefined || v === '') return defaultValue;
    const n = Number(v);
    if (Number.isNaN(n)) {
        throw new Error(`chain-indexer config: env ${name}='${v}' is not a number`);
    }
    return n;
}

function str(name: string, defaultValue: string): string {
    const v = process.env[name];
    return v === undefined || v === '' ? defaultValue : v;
}

function strOptional(name: string): string | undefined {
    const v = process.env[name];
    return v === undefined || v === '' ? undefined : v;
}

function bool(name: string, defaultValue = false): boolean {
    const v = process.env[name];
    if (v === undefined || v === '') return defaultValue;
    return ['1', 'true', 'yes'].includes(v.toLowerCase());
}

export const config: IndexerConfig = {
    rpcEndpoint: str('RPC_ENDPOINT', 'ws://127.0.0.1:9944'),
    archiveGateway: strOptional('ARCHIVE_GATEWAY'),
    startBlock: num('START_BLOCK', 0) ?? 0,
    stopBlock: num('STOP_BLOCK', undefined),
    graphqlPort: num('GRAPHQL_PORT', 4350) ?? 4350,
    allowSchemaSync: bool('CHAIN_INDEXER_ALLOW_SCHEMA_SYNC', false),
    orogenEnv: str('OROGEN_ENV', 'development'),
    db: {
        host: str('DB_HOST', '127.0.0.1'),
        port: num('DB_PORT', 5432) ?? 5432,
        user: str('DB_USER', 'postgres'),
        pass: str('DB_PASS', 'postgres'),
        name: str('DB_NAME', 'chain_indexer'),
    },
};
