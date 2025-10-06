import { Branch } from 'src/Company/branch/branch.entity';
import { Company } from 'src/Company/companies/company.entity';
import { Supplier } from 'src/Company/supplier/supplier.entity';
import { supplierInvoice } from 'src/procurement/enums/supplier-invoice.enum';
import { PurchaseOrder } from 'src/procurement/purchase_order/entities/purchase_order.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('supplier_invoice')
export class SupplierInvoice {
  @PrimaryGeneratedColumn()
  id: number;


  @Column()
  purchase_order_id: number;
  @ManyToOne(() => PurchaseOrder)
  @JoinColumn({ name: 'purchase_order_id' })
  purchaseOrder: PurchaseOrder;

  @Column()
  supplier_id: number;
  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;


  @Column({ type: 'date' })
  invoice_date: Date;

  @Column({ type: 'varchar', length: 50, unique: true })
  invoice_number: string;


  @Column({ type: 'decimal', precision: 12, scale: 2 })
  total_amount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  tax_amount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  discount_amount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  net_amount: number;

  @Column({
    type: 'enum',
    enum: supplierInvoice,
    default: supplierInvoice.UNPAID, // default value
  })
  inv_status: supplierInvoice;

  @Column({ nullable: true })
  due_date: Date;

  @Column({ type: 'varchar', length: 30, nullable: true })
  payment_method: string;   // e.g. CASH, BANK_TRANSFER, ONLINE, CHEQUE



  @Column({ nullable: true })
  payment_terms: string;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  paid_amount: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  outstanding_amount: number;


  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  attachment_path: string;

  @Column({ name: 'created_by', type: 'int', nullable: true })
  created_by?: number;

  @CreateDateColumn({ name: 'created_date', type: 'timestamp' })
  created_date: Date;

  @Column({ name: 'updated_by', type: 'int', nullable: true })
  updated_by?: number;

  @UpdateDateColumn({ name: 'updated_date', type: 'timestamp', nullable: true })
  updated_date?: Date;

  @Column()
  company_id: number;
  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column()
  branch_id: number;
  @ManyToOne(() => Branch)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @Column({ name: 'status', type: 'tinyint', default: 1 })
  status: number;





}
