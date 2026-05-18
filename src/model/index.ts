/**
 * TypeORM entities — hand-written stubs.
 *
 * In a production indexer these are emitted by `sqd codegen` from
 * `schema.graphql`. We ship hand-written stubs so `tsc` passes without
 * requiring the codegen step in CI.
 *
 * The fields and types here mirror `schema.graphql` 1:1.
 */
import 'reflect-metadata';
import {
    Column,
    Entity,
    Index,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
} from 'typeorm';

export enum JobStatus {
    Pending = 'Pending',
    Assigned = 'Assigned',
    Finalized = 'Finalized',
    Disputed = 'Disputed',
    Slashed = 'Slashed',
    Refunded = 'Refunded',
}

export enum SlashKind {
    MissedHeartbeat = 'MissedHeartbeat',
    DisputeUpheld = 'DisputeUpheld',
    AttestationRevoked = 'AttestationRevoked',
    ReceiptMismatch = 'ReceiptMismatch',
    Other = 'Other',
}

export enum SlashStatus {
    Open = 'Open',
    Disputed = 'Disputed',
    Confirmed = 'Confirmed',
    Reversed = 'Reversed',
}

@Entity()
export class Block {
    constructor(props?: Partial<Block>) {
        Object.assign(this, props);
    }

    @PrimaryColumn({ type: 'text' })
    id!: string;

    @Index()
    @Column('integer')
    height!: number;

    @Column({ type: 'text', unique: true })
    hash!: string;

    @Column({ type: 'text' })
    parentHash!: string;

    @Index()
    @Column('timestamp with time zone')
    timestamp!: Date;

    @Column({ type: 'text' })
    stateRoot!: string;

    @Column({ type: 'text' })
    extrinsicsRoot!: string;

    @Column({ nullable: true, type: 'text' })
    validator!: string | null;

    @Column({ type: 'text' })
    specName!: string;

    @Column('integer')
    specVersion!: number;

    @OneToMany(() => Extrinsic, (e) => e.block)
    extrinsics!: Extrinsic[];

    @OneToMany(() => Event, (e) => e.block)
    events!: Event[];
}

@Entity()
export class Extrinsic {
    constructor(props?: Partial<Extrinsic>) {
        Object.assign(this, props);
    }

    @PrimaryColumn({ type: 'text' })
    id!: string;

    @Index()
    @ManyToOne(() => Block, { nullable: false })
    block!: Block;

    @Column('integer')
    indexInBlock!: number;

    @Index()
    @Column({ type: 'text' })
    pallet!: string;

    @Index()
    @Column({ type: 'text' })
    name!: string;

    @Index()
    @Column({ nullable: true, type: 'text' })
    signer!: string | null;

    @Column('boolean')
    success!: boolean;

    @Column('numeric', { nullable: true })
    tip!: bigint | null;

    @Column('numeric', { nullable: true })
    fee!: bigint | null;

    @Column({ type: 'text' })
    hash!: string;

    @Column('jsonb', { nullable: true })
    args!: unknown;

    @OneToMany(() => Event, (e) => e.extrinsic)
    events!: Event[];
}

@Entity()
export class Event {
    constructor(props?: Partial<Event>) {
        Object.assign(this, props);
    }

    @PrimaryColumn({ type: 'text' })
    id!: string;

    @Index()
    @ManyToOne(() => Block, { nullable: false })
    block!: Block;

    @ManyToOne(() => Extrinsic, { nullable: true })
    extrinsic!: Extrinsic | null;

    @Column('integer')
    indexInBlock!: number;

    @Index()
    @Column({ type: 'text' })
    pallet!: string;

    @Index()
    @Column({ type: 'text' })
    name!: string;

    @Column('jsonb', { nullable: true })
    args!: unknown;
}

@Entity()
export class Operator {
    constructor(props?: Partial<Operator>) {
        Object.assign(this, props);
    }

    @PrimaryColumn({ type: 'text' })
    id!: string;

    @Index()
    @Column('integer')
    registeredAt!: number;

    @Column('numeric')
    stake!: bigint;

    @Column({ nullable: true, type: 'text' })
    attestationCid!: string | null;

    @Index()
    @Column('integer', { nullable: true })
    lastHeartbeat!: number | null;

    @Column('boolean')
    active!: boolean;

    @OneToMany(() => SlashEvent, (s) => s.operator)
    slashEvents!: SlashEvent[];
}

@Entity()
export class Job {
    constructor(props?: Partial<Job>) {
        Object.assign(this, props);
    }

    @PrimaryColumn({ type: 'text' })
    id!: string;

    @Index()
    @Column({ type: 'text' })
    customer!: string;

    @Index()
    @Column({ type: 'text' })
    modelId!: string;

    @Column({ nullable: true, type: 'text' })
    adapterId!: string | null;

    @Index()
    @Column({ type: 'enum', enum: JobStatus })
    status!: JobStatus;

    @Index()
    @Column('integer')
    submittedAt!: number;

    @Index()
    @Column({ nullable: true, type: 'text' })
    assignedTo!: string | null;

    @Column('integer', { nullable: true })
    finalizedAt!: number | null;

    @Column({ nullable: true, type: 'text' })
    receiptRoot!: string | null;

    @Column('numeric', { nullable: true })
    costMicroUSD!: bigint | null;
}

@Entity()
export class BurnEvent {
    constructor(props?: Partial<BurnEvent>) {
        Object.assign(this, props);
    }

    @PrimaryColumn({ type: 'text' })
    id!: string;

    @ManyToOne(() => Block, { nullable: false })
    block!: Block;

    @Index()
    @Column('timestamp with time zone')
    timestamp!: Date;

    @Index()
    @Column({ type: 'text' })
    customer!: string;

    @Index()
    @Column({ nullable: true, type: 'text' })
    jobId!: string | null;

    @Column('numeric')
    amount!: bigint;

    @Column('numeric')
    twapPriceMicroUSD!: bigint;
}

@Entity()
export class MintEvent {
    constructor(props?: Partial<MintEvent>) {
        Object.assign(this, props);
    }

    @PrimaryColumn({ type: 'text' })
    id!: string;

    @ManyToOne(() => Block, { nullable: false })
    block!: Block;

    @Index()
    @Column('timestamp with time zone')
    timestamp!: Date;

    @Index()
    @Column({ type: 'text' })
    operator!: string;

    @Index()
    @Column({ nullable: true, type: 'text' })
    jobId!: string | null;

    @Column('numeric')
    amount!: bigint;

    @Index()
    @Column('integer')
    epoch!: number;
}

@Entity()
export class SlashEvent {
    constructor(props?: Partial<SlashEvent>) {
        Object.assign(this, props);
    }

    @PrimaryColumn({ type: 'text' })
    id!: string;

    @ManyToOne(() => Block, { nullable: false })
    block!: Block;

    @Index()
    @ManyToOne(() => Operator, { nullable: false })
    operator!: Operator;

    @Column('numeric')
    amount!: bigint;

    @Index()
    @Column({ type: 'enum', enum: SlashKind })
    kind!: SlashKind;

    @Index()
    @Column({ type: 'enum', enum: SlashStatus })
    status!: SlashStatus;

    @Column({ type: 'text' })
    reasonHash!: string;

    @Column('integer')
    openedAt!: number;

    @Column('integer', { nullable: true })
    resolvedAt!: number | null;
}

@Entity()
export class DisputeEvent {
    constructor(props?: Partial<DisputeEvent>) {
        Object.assign(this, props);
    }

    @PrimaryColumn({ type: 'text' })
    id!: string;

    @ManyToOne(() => Block, { nullable: false })
    block!: Block;

    @ManyToOne(() => SlashEvent, { nullable: false })
    slashEvent!: SlashEvent;

    @Index()
    @Column({ type: 'text' })
    disputant!: string;

    @Column({ type: 'text' })
    evidenceCid!: string;

    @Column({ nullable: true, type: 'text' })
    panelDecision!: string | null;
}

@Entity()
export class AttestationRecord {
    constructor(props?: Partial<AttestationRecord>) {
        Object.assign(this, props);
    }

    @PrimaryColumn({ type: 'text' })
    id!: string;

    @Index()
    @Column({ type: 'text' })
    operator!: string;

    @Index()
    @Column({ type: 'text' })
    vendor!: string;

    @Column({ type: 'text' })
    attestationCid!: string;

    @Column('integer')
    measuredAt!: number;

    @Column('boolean')
    revoked!: boolean;

    @Column('integer', { nullable: true })
    revokedAt!: number | null;
}

@Entity()
export class TwapUpdate {
    constructor(props?: Partial<TwapUpdate>) {
        Object.assign(this, props);
    }

    @PrimaryColumn({ type: 'text' })
    id!: string;

    @ManyToOne(() => Block, { nullable: false })
    block!: Block;

    @Index()
    @Column({ type: 'text' })
    pair!: string;

    @Column('numeric')
    twapMicroUSD!: bigint;

    @Column('integer')
    windowSeconds!: number;
}
