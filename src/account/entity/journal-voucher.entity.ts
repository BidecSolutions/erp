import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, BeforeInsert, OneToMany } from 'typeorm';

@Entity()
export class accountsJournalVoucher {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    chart_of_account_id: number;

    @Column({ type: 'text', unique: true })
    voucher_no: string;

    @Column({ type: 'int', comment: '1 = cash, 2 = credit' })
    voucher_type: number

    @Column({ type: 'int' })
    branch_id: number;

    @Column({ type: 'int' })
    company_id: number;

    @Column({ type: 'date' })
    voucher_date: string;

    @Column({ type: 'text', nullable: true })
    naration: string;

    @Column({ type: 'int' })
    fiscal_year_id: number;

    @Column({ type: 'int', nullable: true })
    total_debit: number;

    @Column({ type: 'int', nullable: true })
    total_credit: number;

    @Column({ type: 'smallint', default: 1, comment: '1 = active, 2 = inactive' })
    status: number;

    @Column({ type: 'int' })
    created_by: number

    @Column({ type: 'int', nullable: true })
    approved_by: number

    @Column({ type: 'date', nullable: true })
    created_at: string;

    @Column({ type: 'date', nullable: true })
    updated_at: string;

    @BeforeInsert()
    setDates() {
        const today = new Date().toISOString().split('T')[0];
        this.created_at = today;
        this.updated_at = today;
    }
}
