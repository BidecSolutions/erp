import { Branch } from '../branch/branch.entity';
import { CustomerCategory } from '../customer-categories/customer-category.entity';
import { Customer } from '../customers/customer.entity';
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  company_name: string;

  @Column({ nullable: true })
  company_logo_path: string;

  @Column({ nullable: true })
  legal_name: string;

  @Column()
  address_line1: string;

  @Column({ nullable: true })
  address_line2: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column()
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

  // 👇 Relation with Branch
  @OneToMany(() => Branch, (branch) => branch.company)
  branches: Branch[];

  // 👇 This is the missing property
  @OneToMany(() => CustomerCategory, (customerCategory) => customerCategory.company)
  customerCategories: CustomerCategory[];

  // Reverse relation for customers
  @OneToMany(() => Customer, (customer) => customer.company)
  customers: Customer[];

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
