import { cp } from 'fs';
import { Company } from 'src/Company/companies/company.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Collection,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('product_brands')
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'brand_code', type: 'varchar', length: 50, unique: true })
  brand_code: string;

  @Column()
  brand_name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Company, { eager: true }) // eager true -> auto load
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column()
  company_id: number;

  @Column()
  branch_id: number;

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
