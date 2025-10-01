import { Branch } from '../branch/branch.entity';
import { CustomerCategory } from '../customer-categories/customer-category.entity';
import { Customer } from '../customers/customer.entity';
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { SupplierCategory } from '../supplier-category/supplier-category.entity';
import { Supplier } from '../supplier/supplier.entity';
import { CustomerPayment } from '../customer-payment/customer-payment.entity';
import { CustomerInvoice } from '../customer-invoice/customer-invoice.entity';
import { SupplierPayment } from '../supplier-payment/supplier-payment.entity';
import { SupplierInvoice } from '../supplier-invoice/supplier-invoice.entity';
import { ChartOfAccount } from '../chart-of-accounts/chart-of-account.entity';
import { SystemConfiguration } from '../system_configuration/system_configuration.entity';
import { SalesOrder } from 'src/sales/sales-order/entity/sales-order.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  company_name: string;

  @Column({ nullable: false })
  company_logo_path: string;

  @Column({ nullable: true })
  legal_name: string;

  @Column()
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
  phone: string;

  @Column({ nullable: true })
  mobile: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  tax_id: string;

  @Column({ nullable: true })
  registration_no: string;

  @Column({ nullable: true })
  license_no: string;

  @Column({ type: 'date', nullable: true })
  incorporation_date: string;

  @Column({ nullable: true })
  company_type: string;

  @Column({ nullable: true })
  currency_code: string;

  @Column({ nullable: true })
  fiscal_year_start: string;

  @Column({ nullable: true })
  time_zone: string;

  @Column({
    type: 'smallint',
    default: 1,
    comment: '1 = active, 2 = inactive',
  })
  status: number;

  @Column({ type: 'int', nullable: true })
  created_by: number;

  @Column({ type: 'date' })
  created_at: string;

  @Column({ type: 'int', nullable: true })
  updated_by: number;

  @Column({ type: 'date' })
  updated_at: string;

  // 👇 Relation with sale-order
  @OneToMany(() => SalesOrder, (salesOrder) => salesOrder.company)
  salesOrders: SalesOrder[];

  // 👇 Relation with Branch
  @OneToMany(() => Branch, (branch) => branch.company)
  branches: Branch[];

  // 👇 This is the missing property
  @OneToMany(() => CustomerCategory, (customerCategory) => customerCategory.company)
  customerCategories: CustomerCategory[];

  // Reverse relation for customers
  @OneToMany(() => Customer, (customer) => customer.company)
  customers: Customer[];

  // One company has many suppliers
  @OneToMany(() => Supplier, (supplier) => supplier.company)
  suppliers: Supplier[];

  // Reverse relation for supplier categories
  @OneToMany(() => SupplierCategory, (supplierCategory) => supplierCategory.company)
  supplierCategories: SupplierCategory[];

  // One company can have many customer payments
  @OneToMany(() => CustomerPayment, (payment) => payment.company)
  customer_payments: CustomerPayment[];

  // One company can have many customer invoices
  @OneToMany(() => CustomerInvoice, (invoice) => invoice.company)
  customer_invoices: CustomerInvoice[];

  // One company can have many supplier payments
  @OneToMany(() => SupplierPayment, (payment) => payment.company)
  supplier_payments: SupplierPayment[];

  // One company can have many supplier invoices
  @OneToMany(() => SupplierInvoice, (invoice) => invoice.company)
  supplier_invoices: SupplierInvoice[];

  // One company can have many chart of accounts
  @OneToMany(() => ChartOfAccount, (chart) => chart.company)
  chartOfAccounts: ChartOfAccount[];

  // One company can have many system configurations
  @OneToMany(() => SystemConfiguration, (config) => config.company)
  systemConfigurations: SystemConfiguration[];

  @BeforeInsert()
  setCreateDate() {
    const today = new Date().toISOString().split('T')[0];
    this.created_at = today;
    this.updated_at = today;
  }

  @BeforeUpdate()
  setUpdateDate() {
    const today = new Date().toISOString().split('T')[0];
    this.updated_at = today;
  }
}
