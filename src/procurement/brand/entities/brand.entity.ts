import { cp } from 'fs';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Collection,
} from 'typeorm';

@Entity('product_brands')
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ name: 'brand_code', type: 'varchar', length: 50, unique: true })
  brand_code: string;

  @Column()
  brand_name : string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;
  
  @Column()
  company_id: number;

  @Column()
  branch_id: number;

  @Column({ name: 'status', type: 'tinyint', default: 1 })
  status: number;

  @Column({ name: 'created_by', nullable: true })
  created_by: number;

  @CreateDateColumn({ name: 'created_date', type: 'timestamp' })
  created_date: Date;
}
