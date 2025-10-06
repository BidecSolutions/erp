import { Company } from 'src/Company/companies/company.entity';
import { TaxSlab } from 'src/sales/tax-slabs/entity/tax-slabs.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeInsert,
    JoinColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';

@Entity('tax_types')
export class TaxType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    company_id: number;

    @ManyToOne(() => Company, (company) => company.id, { onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'company_id' })
    company: Company;

    // ✅ Relation with TaxSlabs
    @OneToMany(() => TaxSlab, (slab) => slab.taxType, { cascade: true })
    slabs: TaxSlab[];

    @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
    tax_code: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    tax_name: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    tax_type: string;

    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    tax_rate: number;

    // ✅ Status column
    @Column({
        type: 'smallint',
        default: 1,
        nullable: false,
        comment: '0 = inactive, 1 = active',
    })
    status: number;

    @Column({ type: 'int', nullable: true })
    created_by: number;


    // ✅ Audit columns
    @Column({ type: 'date', nullable: true })
    created_at: string;

    @Column({ type: 'date', nullable: true })
    updated_at: string;

    // ✅ Before Insert only
    @BeforeInsert()
    setCreateDateParts() {
        const today = new Date();
        const onlyDate = today.toISOString().split('T')[0]; // YYYY-MM-DD
        this.created_at = onlyDate;
        this.updated_at = onlyDate;
    }
}
