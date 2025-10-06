import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, BeforeInsert, OneToMany } from 'typeorm';
import { Company } from '../companies/company.entity';
import { SalesOrder } from 'src/sales/sales-order/entity/sales-order.entity';

@Entity()
export class Branch {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Company, (company) => company.branches)
  company: Company;

  // 👇 Relation with sale-orders
  @OneToMany(() => SalesOrder, (salesOrder) => salesOrder.branch)
  salesOrders: SalesOrder[];

  @Column()
  branch_code: string;

  @Column()
  branch_name: string;

  @Column({ nullable: true })
  branch_type: string;

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
  manager_name: string;

  @Column({ nullable: true })
  manager_email: string;

  @Column({ nullable: true })
  manager_phone: string;

  @Column({ type: 'decimal', default: 0 })
  opening_balance: number;

  @Column({ nullable: true })
  bank_account_no: string;

  @Column({ nullable: true })
  bank_name: string;

  @Column({ nullable: true })
  ifsc_code: string;

  @Column({ default: false })
  is_head_office: boolean;

  @Column({ default: false })
  allow_negative_stock: boolean;

  @Column({ type: 'smallint', default: 1, comment: '1 = active, 2 = inactive' })
  is_active: number;

  @Column({ type: 'int', nullable: true })
  created_by: number;

  @Column({ type: 'date', nullable: true })
  created_date: string;

  @Column({ type: 'int', nullable: true })
  updated_by: number;

  @Column({ type: 'date', nullable: true })
  updated_date: string;

  @BeforeInsert()
  setDates() {
    const today = new Date().toISOString().split('T')[0];
    this.created_date = today;
    this.updated_date = today;
  }
}
