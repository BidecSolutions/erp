import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from 'typeorm';

export enum VoucherType {
    payable = '1',
}

export enum PaymentMode {
    cash = 'cash',
    credit = 'credit',
    online = 'online Transfer'
}

@Entity()
export class accountsReceiptVoucherDetails {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    receipt_voucher_id: number;

    @Column({
        type: 'enum',
        enum: PaymentMode,
    })
    payment_mode: PaymentMode;

    @Column({ type: 'int', nullable: true })
    cheque_id: number;

    @Column({ type: 'int' })
    amount: number;

    @Column({ nullable: true })
    reference_no: string;

    @Column({ nullable: true })
    narration: string;

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
