import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, Relation as Relation_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Block} from "./block.model.js"

@Entity_()
export class MintEvent {
    constructor(props?: Partial<MintEvent>) {
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
    @StringColumn_({nullable: false})
    operator!: string

    @Index_()
    @StringColumn_({nullable: true})
    jobId!: string | undefined | null

    @BigIntColumn_({nullable: false})
    amount!: bigint

    @Index_()
    @IntColumn_({nullable: true})
    epoch!: number | undefined | null
}
