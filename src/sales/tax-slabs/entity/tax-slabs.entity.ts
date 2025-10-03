import { TaxType } from 'src/sales/tax-type/entity/tax-type.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    BeforeInsert,
    OneToMany,
} from 'typeorm';

@Entity('tax_slabs')
export class TaxSlab {
    @PrimaryGeneratedColumn()
    id: number;

    // ---------------- RELATION ----------------
    @Column({ nullable: true })
    tax_type_id: number;

    @ManyToOne(() => TaxType, (taxType) => taxType.slabs, { onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'tax_type_id' })
    taxType: TaxType;

    // ---------------- BUSINESS FIELDS ----------------
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    from_amount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    to_amount: number;

    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    tax_rate: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    fixed_amount: number;


    // ---------------- STATUS & AUDIT ----------------
    @Column({
        type: 'smallint',
        default: 1,
        nullable: false,
        comment: '0 = inactive, 1 = active',
    })
    status: number;

    @Column({ type: 'date', nullable: true })
    created_at: string;

    @Column({ type: 'date', nullable: true })
    updated_at: string;

    // ---------------- LIFECYCLE HOOK ----------------
    @BeforeInsert()
    setCreateDateParts() {
        const today = new Date();
        const onlyDate = today.toISOString().split('T')[0]; // YYYY-MM-DD
        this.created_at = onlyDate;
        this.updated_at = onlyDate;
    }
}
