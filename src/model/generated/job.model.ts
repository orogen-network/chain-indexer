import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {JobStatus} from "./_jobStatus.js"

@Entity_()
export class Job {
    constructor(props?: Partial<Job>) {
        Object.assign(this, props)
    }

    /**
     * 32-byte job id
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @StringColumn_({nullable: false})
    customer!: string

    @Index_()
    @StringColumn_({nullable: true})
    modelId!: string | undefined | null

    @StringColumn_({nullable: true})
    adapterId!: string | undefined | null

    @Index_()
    @Column_("varchar", {length: 9, nullable: false})
    status!: JobStatus

    @Index_()
    @IntColumn_({nullable: false})
    submittedAt!: number

    @Index_()
    @StringColumn_({nullable: true})
    assignedTo!: string | undefined | null

    @IntColumn_({nullable: true})
    finalizedAt!: number | undefined | null

    @StringColumn_({nullable: true})
    receiptRoot!: string | undefined | null

    @BigIntColumn_({nullable: true})
    costMicroUSD!: bigint | undefined | null
}
