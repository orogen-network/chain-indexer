import type { MigrationInterface, QueryRunner } from 'typeorm';

// Generated from schema.graphql by scripts/generate-initial-migration.mjs.
// Run `npm run db:migration:generate` instead of editing this file by hand.
export class Init1716120000000 implements MigrationInterface {
    name = 'Init1716120000000';

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE block (
                id text PRIMARY KEY,
                height integer NOT NULL,
                hash text NOT NULL,
                parent_hash text NOT NULL,
                timestamp timestamp with time zone NOT NULL,
                state_root text NOT NULL,
                extrinsics_root text NOT NULL,
                validator text,
                spec_name text NOT NULL,
                spec_version integer NOT NULL
            )
        `);
        await queryRunner.query(`
            CREATE TABLE extrinsic (
                id text PRIMARY KEY,
                block_id text NOT NULL REFERENCES block(id),
                index_in_block integer NOT NULL,
                pallet text NOT NULL,
                name text NOT NULL,
                signer text,
                success boolean NOT NULL,
                tip numeric,
                fee numeric,
                hash text NOT NULL,
                args jsonb
            )
        `);
        await queryRunner.query(`
            CREATE TABLE event (
                id text PRIMARY KEY,
                block_id text NOT NULL REFERENCES block(id),
                extrinsic_id text REFERENCES extrinsic(id),
                index_in_block integer NOT NULL,
                pallet text NOT NULL,
                name text NOT NULL,
                args jsonb
            )
        `);
        await queryRunner.query(`
            CREATE TABLE operator (
                id text PRIMARY KEY,
                registered_at integer NOT NULL,
                stake numeric NOT NULL,
                attestation_cid text,
                last_heartbeat integer,
                active boolean NOT NULL
            )
        `);
        await queryRunner.query(`
            CREATE TABLE job (
                id text PRIMARY KEY,
                customer text NOT NULL,
                model_id text,
                adapter_id text,
                status varchar(9) NOT NULL CHECK (status IN ('Pending', 'Assigned', 'Finalized', 'Disputed', 'Slashed', 'Refunded')),
                submitted_at integer NOT NULL,
                assigned_to text,
                finalized_at integer,
                receipt_root text,
                cost_micro_usd numeric
            )
        `);
        await queryRunner.query(`
            CREATE TABLE burn_event (
                id text PRIMARY KEY,
                block_id text NOT NULL REFERENCES block(id),
                timestamp timestamp with time zone NOT NULL,
                customer text,
                job_id text,
                amount numeric NOT NULL,
                twap_price_micro_usd numeric
            )
        `);
        await queryRunner.query(`
            CREATE TABLE mint_event (
                id text PRIMARY KEY,
                block_id text NOT NULL REFERENCES block(id),
                timestamp timestamp with time zone NOT NULL,
                operator text NOT NULL,
                job_id text,
                amount numeric NOT NULL,
                epoch integer
            )
        `);
        await queryRunner.query(`
            CREATE TABLE slash_event (
                id text PRIMARY KEY,
                block_id text NOT NULL REFERENCES block(id),
                operator_id text NOT NULL REFERENCES operator(id),
                amount numeric,
                kind varchar(18) NOT NULL CHECK (kind IN ('MissedHeartbeat', 'DisputeUpheld', 'AttestationRevoked', 'ReceiptMismatch', 'Other')),
                fault_code text,
                status varchar(9) NOT NULL CHECK (status IN ('Open', 'Disputed', 'Confirmed', 'Reversed')),
                reason_hash text,
                opened_at integer NOT NULL,
                resolved_at integer
            )
        `);
        await queryRunner.query(`
            CREATE TABLE dispute_event (
                id text PRIMARY KEY,
                block_id text NOT NULL REFERENCES block(id),
                slash_event_id text NOT NULL REFERENCES slash_event(id),
                disputant text,
                evidence_cid text,
                panel_decision text
            )
        `);
        await queryRunner.query(`
            CREATE TABLE attestation_record (
                id text PRIMARY KEY,
                operator text NOT NULL,
                vendor text NOT NULL,
                attestation_cid text NOT NULL,
                measured_at integer NOT NULL,
                revoked boolean NOT NULL,
                revoked_at integer
            )
        `);
        await queryRunner.query(`
            CREATE TABLE twap_update (
                id text PRIMARY KEY,
                block_id text NOT NULL REFERENCES block(id),
                pair text NOT NULL,
                twap_micro_usd numeric NOT NULL,
                window_seconds integer NOT NULL
            )
        `);
        await queryRunner.query('CREATE INDEX idx_block_height ON block(height)');
        await queryRunner.query('CREATE INDEX idx_block_timestamp ON block(timestamp)');
        await queryRunner.query('CREATE UNIQUE INDEX idx_block_hash ON block(hash)');
        await queryRunner.query('CREATE INDEX idx_extrinsic_block_id ON extrinsic(block_id)');
        await queryRunner.query('CREATE INDEX idx_extrinsic_pallet ON extrinsic(pallet)');
        await queryRunner.query('CREATE INDEX idx_extrinsic_name ON extrinsic(name)');
        await queryRunner.query('CREATE INDEX idx_extrinsic_signer ON extrinsic(signer)');
        await queryRunner.query('CREATE INDEX idx_event_block_id ON event(block_id)');
        await queryRunner.query('CREATE INDEX idx_event_extrinsic_id ON event(extrinsic_id)');
        await queryRunner.query('CREATE INDEX idx_event_pallet ON event(pallet)');
        await queryRunner.query('CREATE INDEX idx_event_name ON event(name)');
        await queryRunner.query('CREATE INDEX idx_operator_registered_at ON operator(registered_at)');
        await queryRunner.query('CREATE INDEX idx_operator_last_heartbeat ON operator(last_heartbeat)');
        await queryRunner.query('CREATE INDEX idx_job_customer ON job(customer)');
        await queryRunner.query('CREATE INDEX idx_job_model_id ON job(model_id)');
        await queryRunner.query('CREATE INDEX idx_job_status ON job(status)');
        await queryRunner.query('CREATE INDEX idx_job_submitted_at ON job(submitted_at)');
        await queryRunner.query('CREATE INDEX idx_job_assigned_to ON job(assigned_to)');
        await queryRunner.query('CREATE INDEX idx_burn_event_block_id ON burn_event(block_id)');
        await queryRunner.query('CREATE INDEX idx_burn_event_timestamp ON burn_event(timestamp)');
        await queryRunner.query('CREATE INDEX idx_burn_event_customer ON burn_event(customer)');
        await queryRunner.query('CREATE INDEX idx_burn_event_job_id ON burn_event(job_id)');
        await queryRunner.query('CREATE INDEX idx_mint_event_block_id ON mint_event(block_id)');
        await queryRunner.query('CREATE INDEX idx_mint_event_timestamp ON mint_event(timestamp)');
        await queryRunner.query('CREATE INDEX idx_mint_event_operator ON mint_event(operator)');
        await queryRunner.query('CREATE INDEX idx_mint_event_job_id ON mint_event(job_id)');
        await queryRunner.query('CREATE INDEX idx_mint_event_epoch ON mint_event(epoch)');
        await queryRunner.query('CREATE INDEX idx_slash_event_block_id ON slash_event(block_id)');
        await queryRunner.query('CREATE INDEX idx_slash_event_operator_id ON slash_event(operator_id)');
        await queryRunner.query('CREATE INDEX idx_slash_event_kind ON slash_event(kind)');
        await queryRunner.query('CREATE INDEX idx_slash_event_fault_code ON slash_event(fault_code)');
        await queryRunner.query('CREATE INDEX idx_slash_event_status ON slash_event(status)');
        await queryRunner.query('CREATE INDEX idx_dispute_event_block_id ON dispute_event(block_id)');
        await queryRunner.query('CREATE INDEX idx_dispute_event_slash_event_id ON dispute_event(slash_event_id)');
        await queryRunner.query('CREATE INDEX idx_dispute_event_disputant ON dispute_event(disputant)');
        await queryRunner.query('CREATE INDEX idx_attestation_record_operator ON attestation_record(operator)');
        await queryRunner.query('CREATE INDEX idx_attestation_record_vendor ON attestation_record(vendor)');
        await queryRunner.query('CREATE INDEX idx_twap_update_block_id ON twap_update(block_id)');
        await queryRunner.query('CREATE INDEX idx_twap_update_pair ON twap_update(pair)');
        await queryRunner.query('CREATE SCHEMA IF NOT EXISTS squid_processor');
        await queryRunner.query(`
            CREATE TABLE squid_processor.status (
                id integer PRIMARY KEY,
                height integer NOT NULL,
                hash text NOT NULL,
                nonce integer NOT NULL
            )
        `);
        await queryRunner.query(`
            INSERT INTO squid_processor.status (id, height, hash, nonce)
            VALUES (0, -1, '0x', 0)
        `);
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE IF EXISTS squid_processor.status');
        await queryRunner.query('DROP SCHEMA IF EXISTS squid_processor');
        await queryRunner.query('DROP TABLE IF EXISTS twap_update');
        await queryRunner.query('DROP TABLE IF EXISTS attestation_record');
        await queryRunner.query('DROP TABLE IF EXISTS dispute_event');
        await queryRunner.query('DROP TABLE IF EXISTS slash_event');
        await queryRunner.query('DROP TABLE IF EXISTS mint_event');
        await queryRunner.query('DROP TABLE IF EXISTS burn_event');
        await queryRunner.query('DROP TABLE IF EXISTS job');
        await queryRunner.query('DROP TABLE IF EXISTS operator');
        await queryRunner.query('DROP TABLE IF EXISTS event');
        await queryRunner.query('DROP TABLE IF EXISTS extrinsic');
        await queryRunner.query('DROP TABLE IF EXISTS block');
    }
}
