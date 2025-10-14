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
export class accountsPaymentVoucherDetails {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    payment_voucher_id: number;

    @Column()
    amount: number;

    @Column({
        type: 'enum',
        enum: ['supplier', 'asset'],
    })
    pay_to: string;

    @Column({ type: 'text', nullable: true })
    account_number: string;

    @Column({ type: 'text', nullable: true })
    account_title: string;

    @Column({ type: 'text', nullable: true })
    account_bank_name: string;

    @Column({ type: 'text', nullable: true })
    cheque_number: string;

    @Column({ type: 'date', nullable: true })
    cheque_clearance_date: string;

    @Column({
        type: 'enum',
        enum: ['draft', 'posted', 'cancelled'],
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
