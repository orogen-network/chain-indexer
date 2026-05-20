import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, Relation as Relation_, IntColumn as IntColumn_, StringColumn as StringColumn_, JSONColumn as JSONColumn_} from "@subsquid/typeorm-store"
import {Block} from "./block.model.js"
import {Extrinsic} from "./extrinsic.model.js"

@Entity_()
export class Event {
    constructor(props?: Partial<Event>) {
        Object.assign(this, props)
    }

    /**
     * blockHash-eventIndex
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Block, {nullable: true})
    block!: Relation_<Block>

    @Index_()
    @ManyToOne_(() => Extrinsic, {nullable: true})
    extrinsic!: Relation_<Extrinsic> | undefined | null

    @IntColumn_({nullable: false})
    indexInBlock!: number

    @Index_()
    @StringColumn_({nullable: false})
    pallet!: string

    @Index_()
    @StringColumn_({nullable: false})
    name!: string

    @JSONColumn_({nullable: true})
    args!: unknown | undefined | null
}
