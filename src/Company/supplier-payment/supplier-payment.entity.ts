import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { Company } from '../companies/company.entity';
import { Supplier } from '../supplier/supplier.entity';

@Entity('supplier_payment')
export class SupplierPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Company, (company) => company.supplier_payments, { onDelete: 'CASCADE' })
  company: Company;

  @ManyToOne(() => Supplier, (supplier) => supplier.supplier_payments, { onDelete: 'CASCADE' })
  supplier: Supplier;

  @Column()
  payment_no: string;

  @Column({ type: 'date' })
  payment_date: string;

  @Column()
  payment_method: string;

  @Column()
  payment_account_id: number;

  @Column('decimal', { precision: 12, scale: 2 })
  payment_amount: number;

  @Column()
  currency_code: string;

  @Column('decimal', { precision: 12, scale: 4, default: 1 })
  exchange_rate: number;

  @Column({ nullable: true })
  reference_no: string;

  @Column({ nullable: true })
  notes: string;

  @Column()
  payment_status: string;

  @Column({ nullable: true })
  attachment_path: string;

  @Column()
  created_by: string;

  @Column({ type: 'date' })
  created_date: string;

  @Column({ nullable: true })
  updated_by: string;

  @Column({ type: 'date', nullable: true })
  updated_date: string;

  @BeforeInsert()
  setDates() {
    const today = new Date().toISOString().split('T')[0];
    this.created_date = today;
    this.updated_date = today;
  }
}
