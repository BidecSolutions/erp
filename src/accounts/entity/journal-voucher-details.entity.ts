import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from 'typeorm';

export enum VoucherType {
    CASH = '1',
    CREDIT = '2',
}

@Entity()
export class accountsJournalVoucherDetails {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    journal_voucher_id: number;

    @Column({ nullable: true })
    COA_credit_id: number;

    @Column({ nullable: true })
    COA_debit_id: number;

    @Column({ nullable: true })
    narration: string;

    @Column()
    amount: number;

    @Column({ type: 'tinyint', default: 1, comment: '1 = active, 0 = inactive' })
    status: number;

    @Column({ type: 'tinyint', default: 0, comment: '1 = approved, 0 = Pending' })
    is_approved: number;


    @Column({ type: 'tinyint' })
    approved_by: number;


    @Column({ type: 'date', nullable: true })
    created_at: string;

    @Column({ type: 'date', nullable: true })
    updated_at: string;

    @BeforeInsert()
    setCreatedDate() {
        const today = new Date().toISOString().slice(0, 10);
        this.created_at = today;
        this.updated_at = today;
    }

}
