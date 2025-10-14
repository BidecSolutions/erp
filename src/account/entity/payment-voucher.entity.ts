import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class accountsPaymentVoucher {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    company_id: number;

    @Column({ type: 'int' })
    branch_id: number;

    @Column()
    fiscal_year_id: number;

    @Column({ type: 'varchar', unique: true })
    voucher_no: string;

    @Column({ type: 'date' })
    voucher_date: Date;

    @Column({ type: 'varchar', length: 50, comment: '1 - CASH, 2 - CHEQUE, 3 - BANK_TRANSFER' })
    payment_mode: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    reference_no?: string;

    @Column({ type: 'text', nullable: true })
    narration?: string;

    @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
    total_debit: number;

    @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
    total_credit: number;

    @Column({ type: 'text', nullable: true })
    image: string;

    @Column({
        type: 'enum',
        enum: ['pending', 'draft', 'posted', 'cancelled'],
        default: 'draft',
    })
    status: string;

    @Column()
    created_by: number;


    @Column({ nullable: true })
    approved_by?: number;


    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
