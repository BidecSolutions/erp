import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { Company } from '../../companies/company.entity';
import { Customer } from '../../customers/customer.entity';
import { SalesOrder } from 'src/sales/sales-order/entity/sales-order.entity';
// import { InvoiceStatus, PaymentMethod } from 'src/sales/enums/sales-enums';
import { customer_invoice_items } from './customer-invoice-items.entity';

@Entity('customer_invoice')
export class CustomerInvoice {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => customer_invoice_items, (item) => item.customerInvoice, { cascade: true })
  invoiceItems: customer_invoice_items[];

  @ManyToOne(() => Company, (company) => company.customer_invoices, { onDelete: 'CASCADE' })
  company: Company;

  @ManyToOne(() => Customer, (customer) => customer.invoices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => SalesOrder, (order) => order.customerInvoices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sales_order_id' })
  salesOrder: SalesOrder;

  @Column()
  branch_id: number;

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

  // @Column({
  //   type: 'enum',
  //   default: InvoiceStatus.UNPAID,
  //   enum: InvoiceStatus,
  // })
  // invoice_status: InvoiceStatus;

  // @Column({
  //   type: 'enum',
  //   enum: PaymentMethod,
  // })
  // payment_method: PaymentMethod;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  attachment_path: string;

  @Column({ nullable: true })
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
