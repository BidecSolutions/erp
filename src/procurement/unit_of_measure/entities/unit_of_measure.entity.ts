import { Company } from 'src/Company/companies/company.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';

@Entity('unit_of_measures')
export class UnitOfMeasure {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'uom_code', type: 'varchar', length: 50, unique: true })
  uom_code: string;

  @Column({ name: 'uom_name', type: 'varchar', length: 100 })
  uom_name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'status', type: 'tinyint', default: 1 })
  status: number;

  @ManyToOne(() => Company, { eager: true }) // eager true -> auto load
  @JoinColumn({ name: 'company_id' })
  company: Company;
  @Column()
  company_id: number;

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
