import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { Company } from '../companies/company.entity';
import { Customer } from '../customers/customer.entity';
import { SalesOrder } from 'src/sales/sales-order/entity/sales-order.entity';

@Entity('customer_invoice')
export class CustomerInvoice {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Company, (company) => company.customer_invoices, { onDelete: 'CASCADE' })
  company: Company;

  @ManyToOne(() => Customer, (customer) => customer.customer_invoices, { onDelete: 'CASCADE' })
  customer: Customer;

  @ManyToOne(() => SalesOrder, (order) => order.customerInvoices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sales_order_id' })
  salesOrder: SalesOrder;

  @Column()
  sales_order_id: number;

  @Column()
  invoice_no: string;

  @Column({ type: 'date' })
  invoice_date: string;

  @Column({ type: 'date' })
  due_date: string;

  @Column({ nullable: true })
  payment_terms: string;

  @Column('decimal', { precision: 12, scale: 2 })
  subtotal: number;

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
  invoice_status: string;

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

  @BeforeInsert()
  setDates() {
    const today = new Date().toISOString().split('T')[0];
    this.created_date = today;
    this.updated_date = today;
  }
}
