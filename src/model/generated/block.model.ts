import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_, OneToMany as OneToMany_, Relation as Relation_} from "@subsquid/typeorm-store"
import {Extrinsic} from "./extrinsic.model.js"
import {Event} from "./event.model.js"

/**
 * Orogen Network — chain indexer schema.
 * 
 * Mirrors the on-chain event surface of pallet-suite (model-registry,
 * operator-stake, job-market, bme, slashing, pouw-mint, attestation-registry,
 * oracle-twap, nonce-vault, treasury-ext) plus standard block/extrinsic/event
 * walls. Granularity: per-block.
 * 
 * Generated TypeORM entities are emitted under src/model/generated/ by
 * `npm run codegen:models`. Runtime metadata-backed event/call accessors are
 * emitted under src/types/generated/ by `npm run codegen:types`.
 */
@Entity_()
export class Block {
    constructor(props?: Partial<Block>) {
        Object.assign(this, props)
    }

    /**
     * block.id = hash
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    height!: number

    @Index_({unique: true})
    @StringColumn_({nullable: false})
    hash!: string

    @StringColumn_({nullable: false})
    parentHash!: string

    @Index_()
    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @StringColumn_({nullable: false})
    stateRoot!: string

    @StringColumn_({nullable: false})
    extrinsicsRoot!: string

    @StringColumn_({nullable: true})
    validator!: string | undefined | null

    @StringColumn_({nullable: false})
    specName!: string

    @IntColumn_({nullable: false})
    specVersion!: number

    @OneToMany_(() => Extrinsic, e => e.block)
    extrinsics!: Relation_<Extrinsic[]>

    @OneToMany_(() => Event, e => e.block)
    events!: Relation_<Event[]>
}
