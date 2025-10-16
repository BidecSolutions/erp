import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from 'typeorm';

export enum VoucherType {
    payable = '1',
}

@Entity()
export class accountsChequesDetails {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    bank_name: string;

    @Column({ nullable: true })
    account_titile: string;

    @Column({ nullable: true })
    account_number: string;

    @Column({ nullable: true })
    cheque_no: string;

    @Column({ type: 'date', nullable: true })
    post_date: string;

    @Column({ type: 'date', nullable: true })
    clearance_date: string;

    @Column({ nullable: true })
    image: string;

    @Column({ type: 'tinyint', default: 1, comment: '0 = pending, 1 = clear' })
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
