import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, Relation as Relation_, StringColumn as StringColumn_} from "@subsquid/typeorm-store"
import {Block} from "./block.model.js"
import {SlashEvent} from "./slashEvent.model.js"

@Entity_()
export class DisputeEvent {
    constructor(props?: Partial<DisputeEvent>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Block, {nullable: true})
    block!: Relation_<Block>

    @Index_()
    @ManyToOne_(() => SlashEvent, {nullable: true})
    slashEvent!: Relation_<SlashEvent>

    @Index_()
    @StringColumn_({nullable: true})
    disputant!: string | undefined | null

    @StringColumn_({nullable: true})
    evidenceCid!: string | undefined | null

    @StringColumn_({nullable: true})
    panelDecision!: string | undefined | null
}
