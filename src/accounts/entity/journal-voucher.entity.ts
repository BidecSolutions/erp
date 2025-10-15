import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from 'typeorm';

export enum VoucherType {
    normal = '1',
    purchase = '2',
    sale = '3'
}

@Entity()
export class accountsJournalVoucher {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    chart_of_account_id: number;

    @Column()
    fiscal_year_id: string;

    @Column({ type: 'int' })
    branch_id: number;

    @Column({ type: 'int' })
    company_id: number;

    @Column()
    voucher_no: string;

    @Column({
        type: 'enum',
        enum: VoucherType,
        comment: '1 = normal , 2 = purchase , 3 = sale',
    })
    voucher_type: VoucherType;

    @Column({ nullable: true })
    reference_no: string;

    @Column({ nullable: true })
    narration: string;

    @Column({ type: 'int' })
    created_by: number;

    @Column({ type: 'int' })
    approved_by: number;

    @Column({ type: 'tinyint', default: 1, comment: '1 = active, 0 = inactive' })
    status: number;

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
