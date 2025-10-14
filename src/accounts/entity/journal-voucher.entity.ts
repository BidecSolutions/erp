import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from 'typeorm';


export enum VoucherType {
    CASH = '1',
    CREDIT = '2',
}


@Entity()
export class accountsJournalVoucher {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    chart_of_account_id: number;

    @Column()
    fiscal_year: string;

    @Column()
    voucher_no: string;

    @Column()
    voucher_type: string;



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
