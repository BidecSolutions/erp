import { Branch } from 'src/Company/branch/branch.entity';
import { Company } from 'src/Company/companies/company.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';

@Entity('product_categories')
export class Category {
  @PrimaryGeneratedColumn({ name: 'category_id' })
  id: number;

  @ManyToOne(() => Company, { eager: true }) // eager true -> auto load
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column()
  company_id: number;

  @Column({ name: 'branch_id', nullable: false })
  branch_id: number;
  @ManyToOne(() => Branch)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch

  @Column({ name: 'category_code', length: 50, unique: true })
  category_code: string;

  @Column({ name: 'category_name', length: 255 })
  category_name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'status', type: 'tinyint', default: 1 })
  status: number;

  @Column({ nullable: true })
  created_by: number;

  @Column({ nullable: true })
  updated_by: number;

  @Column({ type: 'date', nullable: true })
  created_at: string;

  @Column({ type: 'date', nullable: true })
  updated_at: string;

  @BeforeInsert()
  setDefaults() {
    const now = new Date();
    this.created_at = now.toISOString().split('T')[0];
    this.updated_at = now.toISOString().split('T')[0];
  }
}
