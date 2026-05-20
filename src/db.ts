import 'reflect-metadata';
import { DataSource } from 'typeorm';

// Subsquid's typeorm-store queries with this naming strategy.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - runtime-only path without a bundled declaration file
import { SnakeNamingStrategy } from '@subsquid/typeorm-config/lib/namingStrategy.js';

import { config } from './config.js';
import { Init1716120000000 } from './migrations/1716120000000-Init.js';
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
} from './model/generated/index.js';

export const ENTITIES = [
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
] as const;

export const MIGRATIONS = [Init1716120000000] as const;

export function createDataSource(options: { synchronize: boolean }): DataSource {
    return new DataSource({
        type: 'postgres',
        host: config.db.host,
        port: config.db.port,
        username: config.db.user,
        password: config.db.pass,
        database: config.db.name,
        entities: [...ENTITIES],
        migrations: [...MIGRATIONS],
        synchronize: options.synchronize,
        namingStrategy: new SnakeNamingStrategy(),
        logging: ['error', 'warn'],
    });
}
