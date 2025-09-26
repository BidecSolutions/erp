import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { Company } from '../companies/company.entity';
import { SupplierCategory } from '../supplier-category/supplier-category.entity';
import { SupplierPayment } from '../supplier-payment/supplier-payment.entity';
import { SupplierInvoice } from '../supplier-invoice/supplier-invoice.entity';
import { SupplierAccount } from './supplier.supplier_account.entity';

@Entity('supplier')
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Company, (company) => company.suppliers, { onDelete: 'CASCADE' })
  company: Company;

  @ManyToOne(() => SupplierCategory, (category) => category.suppliers, {
    onDelete: 'CASCADE',
  })
  category: SupplierCategory;

  @OneToMany(() => SupplierAccount, (account) => account.supplier)
  accounts: SupplierAccount[];

  // One supplier can have many payments
  @OneToMany(() => SupplierPayment, (payment) => payment.supplier)
  supplier_payments: SupplierPayment[];

  // One supplier can have many invoices
  @OneToMany(() => SupplierInvoice, (invoice) => invoice.supplier)
  supplier_invoices: SupplierInvoice[];

  @Column()
  supplier_code: string;

  @Column()
  supplier_name: string;

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

  @Column({ nullable: true })
  payment_terms: string;

  @Column({ nullable: true, type: 'int' })
  credit_days: number;

  @Column({ nullable: true })
  tax_id: string;

  @Column({ nullable: true })
  gst_no: string;

  @Column({ nullable: true })
  pan_no: string;

  @Column({ nullable: true, type: 'decimal', precision: 12, scale: 2 })
  opening_balance: number;

  @Column({ nullable: true })
  balance_type: string;

  @Column({ nullable: true })
  supplier_status: string;

  @Column({ type: 'date', nullable: true })
  registration_date: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  bank_account_no: string;

  @Column({ nullable: true })
  bank_name: string;

  @Column({ nullable: true })
  ifsc_code: string;

  @Column({ type: 'smallint', default: 1, comment: '1=active, 2=inactive' })
  is_active: number;

  @Column({ nullable: true })
  created_by: string;

  @Column({ type: 'date', nullable: true })
  created_date: string;

  @Column({ nullable: true })
  updated_by: string;

  @Column({ type: 'date', nullable: true })
  updated_date: string;

  @BeforeInsert()
  setCreateDate() {
    const today = new Date().toISOString().split('T')[0];
    this.created_date = today;
    this.updated_date = today;
  }
}
