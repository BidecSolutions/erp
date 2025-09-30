import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import { Company } from '../companies/company.entity';
import { CustomerCategory } from '../customer-categories/customer-category.entity';
import { CustomerPayment } from '../customer-payment/customer-payment.entity';
import { CustomerInvoice } from '../customer-invoice/customer-invoice.entity';
import { CustomerAccount } from './customer.customer_account.entity';
import { SalesOrder } from 'src/sales/sales-order/entity/sales-order.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Company, (company) => company.customers, { onDelete: 'CASCADE' })
  company: Company;

  @ManyToOne(() => CustomerCategory, (category) => category.customers, {
    onDelete: 'CASCADE',
  })
  category_customer: CustomerCategory;

  @OneToMany(() => CustomerAccount, (account) => account.customer)
  accounts: CustomerAccount[];

  // One customer can have many payments
  @OneToMany(() => CustomerPayment, (payment) => payment.customer)
  customer_payments: CustomerPayment[];

  // One customer can have many invoices
  @OneToMany(() => CustomerInvoice, (invoice) => invoice.customer)
  customer_invoices: CustomerInvoice[];

  // 👇 Relation with sale-order
  @OneToMany(() => SalesOrder, (salesOrder) => salesOrder.customer)
  salesOrders: SalesOrder[];

  @Column()
  customer_code: string;

  @Column()
  customer_name: string;

  @Column()
  customer_type: string;

  @Column({ nullable: true })
  contact_person: string;

  @Column({ nullable: true })
  designation: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  mobile: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  address_line1: string;

  @Column({ nullable: true })
  address_line2: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  postal_code: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  credit_limit: number;

  @Column({ type: 'int', default: 0 })
  credit_days: number;

  @Column({ nullable: true })
  payment_terms: string;

  @Column({ nullable: true })
  tax_id: string;

  @Column({ nullable: true })
  gst_no: string;

  @Column({ nullable: true })
  pan_no: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  opening_balance: number;

  @Column({ nullable: true })
  balance_type: string; // Debit / Credit

  @Column({ nullable: true })
  customer_status: string;

  @Column({ type: 'date', nullable: true })
  registration_date: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true })
  assigned_sales_person: string;

  @Column({ type: 'smallint', default: 1, comment: '1=active, 2=inactive' })
  is_active: number;

  @Column({nullable:true})
  created_by: number;

  @Column({ type: 'date' })
  created_date: string;

  @Column({ nullable: true })
  updated_by: number;

  @Column({ type: 'date', nullable: true })
  updated_date: string;

  @BeforeInsert()
  setCreateDate() {
    const today = new Date().toISOString().split('T')[0];
    this.created_date = today;
    this.updated_date = today;
  }

  @BeforeUpdate()
  setUpdateDate() {
    const today = new Date().toISOString().split('T')[0];
    this.updated_date = today;
  }
}
