import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, BigIntColumn as BigIntColumn_, StringColumn as StringColumn_, BooleanColumn as BooleanColumn_, OneToMany as OneToMany_, Relation as Relation_} from "@subsquid/typeorm-store"
import {SlashEvent} from "./slashEvent.model.js"

@Entity_()
export class Operator {
    constructor(props?: Partial<Operator>) {
        Object.assign(this, props)
    }

    /**
     * 32-byte hotkey ss58
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    registeredAt!: number

    @BigIntColumn_({nullable: false})
    stake!: bigint

    @StringColumn_({nullable: true})
    attestationCid!: string | undefined | null

    @Index_()
    @IntColumn_({nullable: true})
    lastHeartbeat!: number | undefined | null

    @BooleanColumn_({nullable: false})
    active!: boolean

    @OneToMany_(() => SlashEvent, e => e.operator)
    slashEvents!: Relation_<SlashEvent[]>
}
