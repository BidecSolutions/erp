import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { Company } from '../companies/company.entity';
import { Customer } from '../customers/customer.entity';

@Entity()
export class CustomerCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Company, (company) => company.customerCategories, {
    onDelete: 'CASCADE',
  })
  company: Company;


  @OneToMany(() => Customer, (customer) => customer.category_customer)
  customers: Customer[];

  @Column()
  category_code: string;

  @Column()
  category_name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discount_percent: number;

  @Column({
    type: 'smallint',
    default: 1,
    comment: '1 = active, 2 = inactive',
  })
  is_active: number;

  @Column()
  created_by: string;

  @Column({ type: 'date' })
  created_date: string;

  @BeforeInsert()
  setCreatedDate() {
    const today = new Date().toISOString().split('T')[0];
    this.created_date = today;
  }
}
