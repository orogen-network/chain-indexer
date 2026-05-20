import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, Relation as Relation_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {Block} from "./block.model.js"

@Entity_()
export class BurnEvent {
    constructor(props?: Partial<BurnEvent>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Block, {nullable: true})
    block!: Relation_<Block>

    @Index_()
    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @Index_()
    @StringColumn_({nullable: true})
    customer!: string | undefined | null

    @Index_()
    @StringColumn_({nullable: true})
    jobId!: string | undefined | null

    @BigIntColumn_({nullable: false})
    amount!: bigint

    @BigIntColumn_({nullable: true})
    twapPriceMicroUSD!: bigint | undefined | null
}
