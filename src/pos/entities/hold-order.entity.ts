import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { Company } from 'src/Company/companies/company.entity';
import { Branch } from 'src/Company/branch/branch.entity';
import { Customer } from 'src/Company/customers/customer.entity';
import { HoldOrderDetail } from './hold-order-detail.entity';


// HoldStatus enum
export enum HoldStatus {
  HOLD = 'HOLD',
  COMPLETED = 'COMPLETED',
}

@Entity('hold_orders')
export class HoldOrder {
  @PrimaryGeneratedColumn()
  id: number;

  // Relations
  @ManyToOne(() => Company, (company) => company.id, { nullable: true, onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => Branch, (branch) => branch.id, { nullable: true, onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @ManyToOne(() => Customer, (customer) => customer.id, { nullable: true, onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @OneToMany(() => HoldOrderDetail, (detail) => detail.holdOrder, { cascade: true })
  holdOrderDetails: HoldOrderDetail[];

  // Hold-specific status
  @Column({ type: 'enum', enum: HoldStatus, default: HoldStatus.HOLD })
  hold_status: HoldStatus;

  // Basic fields (same as SalesOrder, pricing fields nullable)
  @Column({ nullable: true })
  company_id: number;

  @Column({ nullable: true })
  branch_id: number;

  @Column({ nullable: true })
  customer_id: number;

  @Column({ default: 1 })
  sales_person_id: number;

  @Column({ length: 50, nullable: true })
  hold_no: string;

  @Column({ type: 'date', nullable: true })
  order_date: Date;

  @Column({ type: 'date', nullable: true })
  expected_delivery_date: Date;

  @Column({ type: 'date', nullable: true })
  actual_delivery_date: Date;

  @Column({ length: 50, nullable: true })
  order_priority: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  tax_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discount_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  shipping_charges: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  total_amount: number;

  @Column({ length: 50, nullable: true })
  order_status: string;

  @Column({ length: 50, nullable: true })
  delivery_status: string;

  @Column({ length: 50, nullable: true })
  payment_status: string;

  @Column({ length: 10, nullable: true })
  currency_code: string;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  exchange_rate: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  terms_conditions: string;

  @Column({ type: 'text', nullable: true })
  delivery_address: string;

  @Column({ nullable: true })
  created_by: number;

  @Column({ nullable: true })
  updated_by: number;

  @Column({ nullable: true })
  approved_by: number;

  @Column({ type: 'datetime', nullable: true })
  approved_date: Date;

  @Column({ type: 'smallint', default: 1, nullable: false, comment: '0 = inactive, 1 = active' })
  status: number;

  @Column({ type: 'date', nullable: true })
  created_at: string;

  @Column({ type: 'date', nullable: true })
  updated_at: string;

  @BeforeInsert()
  setCreateDateParts() {
    const today = new Date();
    const onlyDate = today.toISOString().split('T')[0];
    this.created_at = onlyDate;
    this.updated_at = onlyDate;
  }
}

