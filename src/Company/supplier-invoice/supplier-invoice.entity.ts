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

@Entity('supplier_invoice')
export class SupplierInvoice {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Company, (company) => company.supplier_invoices, { onDelete: 'CASCADE' })
  company: Company;

  @ManyToOne(() => Supplier, (supplier) => supplier.supplier_invoices, { onDelete: 'CASCADE' })
  supplier: Supplier;

  @Column({ nullable: true })
  purchase_order_id: number;

  @Column()
  bill_no: string;

  @Column()
  supplier_bill_no: string;

  @Column({ type: 'date' })
  bill_date: string;

  @Column({ type: 'date' })
  due_date: string;

  @Column({ nullable: true })
  payment_terms: string;

  @Column('decimal', { precision: 12, scale: 2 })
  bill_amount: number;

  @Column('decimal', { precision: 12, scale: 2 })
  tax_amount: number;

  @Column('decimal', { precision: 12, scale: 2 })
  discount_amount: number;

  @Column('decimal', { precision: 12, scale: 2 })
  total_amount: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  paid_amount: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  outstanding_amount: number;

  @Column()
  bill_status: string;

  @Column()
  approval_status: string;

  @Column()
  currency_code: string;

  @Column('decimal', { precision: 12, scale: 4, default: 1 })
  exchange_rate: number;

  @Column({ nullable: true })
  notes: string;

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

  @Column({ nullable: true })
  approved_by: string;

  @Column({ type: 'date', nullable: true })
  approved_date: string;

  @BeforeInsert()
  setDates() {
    const today = new Date().toISOString().split('T')[0];
    this.created_date = today;
    this.updated_date = today;
  }
}
