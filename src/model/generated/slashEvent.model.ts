import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, Relation as Relation_, BigIntColumn as BigIntColumn_, StringColumn as StringColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Block} from "./block.model.js"
import {Operator} from "./operator.model.js"
import {SlashKind} from "./_slashKind.js"
import {SlashStatus} from "./_slashStatus.js"

@Entity_()
export class SlashEvent {
    constructor(props?: Partial<SlashEvent>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Block, {nullable: true})
    block!: Relation_<Block>

    @Index_()
    @ManyToOne_(() => Operator, {nullable: true})
    operator!: Relation_<Operator>

    @BigIntColumn_({nullable: true})
    amount!: bigint | undefined | null

    @Index_()
    @Column_("varchar", {length: 18, nullable: false})
    kind!: SlashKind

    @Index_()
    @Column_("varchar", {length: 9, nullable: false})
    status!: SlashStatus

    @StringColumn_({nullable: true})
    reasonHash!: string | undefined | null

    @IntColumn_({nullable: false})
    openedAt!: number

    @IntColumn_({nullable: true})
    resolvedAt!: number | undefined | null
}
