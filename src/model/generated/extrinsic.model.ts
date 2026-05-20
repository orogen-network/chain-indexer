import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, Relation as Relation_, IntColumn as IntColumn_, StringColumn as StringColumn_, BooleanColumn as BooleanColumn_, BigIntColumn as BigIntColumn_, JSONColumn as JSONColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {Block} from "./block.model.js"
import {Event} from "./event.model.js"

@Entity_()
export class Extrinsic {
    constructor(props?: Partial<Extrinsic>) {
        Object.assign(this, props)
    }

    /**
     * blockHash-index
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Block, {nullable: true})
    block!: Relation_<Block>

    @IntColumn_({nullable: false})
    indexInBlock!: number

    @Index_()
    @StringColumn_({nullable: false})
    pallet!: string

    @Index_()
    @StringColumn_({nullable: false})
    name!: string

    @Index_()
    @StringColumn_({nullable: true})
    signer!: string | undefined | null

    @BooleanColumn_({nullable: false})
    success!: boolean

    @BigIntColumn_({nullable: true})
    tip!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    fee!: bigint | undefined | null

    @StringColumn_({nullable: false})
    hash!: string

    @JSONColumn_({nullable: true})
    args!: unknown | undefined | null

    @OneToMany_(() => Event, e => e.extrinsic)
    events!: Relation_<Event[]>
}
