import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, Relation as Relation_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Block} from "./block.model.js"

@Entity_()
export class TwapUpdate {
    constructor(props?: Partial<TwapUpdate>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Block, {nullable: true})
    block!: Relation_<Block>

    @Index_()
    @StringColumn_({nullable: false})
    pair!: string

    @BigIntColumn_({nullable: false})
    twapMicroUSD!: bigint

    @IntColumn_({nullable: false})
    windowSeconds!: number
}
