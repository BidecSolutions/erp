import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Company } from '../companies/company.entity';
import { Customer } from '../customers/customer.entity';

@Entity('customer_payments')
export class CustomerPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Company, (company) => company.customer_payments, { onDelete: 'CASCADE' })
  company: Company;

  @ManyToOne(() => Customer, (customer) => customer.customer_payments, { onDelete: 'CASCADE' })
  customer: Customer;

  @Column()
  receipt_no: string;

  @Column({ type: 'date' })
  receipt_date: string;

  @Column()
  payment_method: string;

  @Column()
  deposit_account_id: number;

  @Column('decimal', { precision: 12, scale: 2 })
  receipt_amount: number;

  @Column()
  currency_code: string;

  @Column('decimal', { precision: 10, scale: 4 })
  exchange_rate: number;

  @Column({ nullable: true })
  reference_no: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ type: 'smallint', default: 1, comment: '1 = active, 2 = inactive' })
  status: number;

  @Column({ nullable: true })
  attachment_path: string;

  @Column()
  created_by: string;

  @Column({ type: 'date' })
  created_date: string;

  @Column({ nullable: true })
  update_by: string;

  @Column({ type: 'date', nullable: true })
  update_date: string;

  @BeforeInsert()
  setCreateDate() {
    const today = new Date().toISOString().split('T')[0];
    this.created_date = today;
    this.update_date = today;
  }

  @BeforeUpdate()
  setUpdateDate() {
    this.update_date = new Date().toISOString().split('T')[0];
  }
}
