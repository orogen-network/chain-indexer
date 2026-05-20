import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, IntColumn as IntColumn_, BooleanColumn as BooleanColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class AttestationRecord {
    constructor(props?: Partial<AttestationRecord>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @StringColumn_({nullable: false})
    operator!: string

    @Index_()
    @StringColumn_({nullable: false})
    vendor!: string

    @StringColumn_({nullable: false})
    attestationCid!: string

    @IntColumn_({nullable: false})
    measuredAt!: number

    @BooleanColumn_({nullable: false})
    revoked!: boolean

    @IntColumn_({nullable: true})
    revokedAt!: number | undefined | null
}
