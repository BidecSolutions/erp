import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, BeforeInsert } from 'typeorm';
import { Product } from 'src/procurement/product/entities/product.entity';
import { Company } from 'src/Company/companies/company.entity';

@Entity('warranties')
export class Warranty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  warranty_type: string;

  @Column()
  duration: string;

  @Column({ name: 'status', default: 1 })
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