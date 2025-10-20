import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';

@Entity('warehouses')
export class Warehouse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  warehouse_code: string;

  @Column({ length: 255 })
  warehouse_name: string;

  @Column({ length: 50, nullable: true })
  warehouse_type?: string;

  @Column({ length: 255, nullable: true })
  address_line1?: string;

  @Column({ length: 255, nullable: true })
  address_line2?: string;

  @Column({ length: 100, nullable: true })
  city?: string;

  @Column({ length: 100, nullable: true })
  state?: string;

  @Column({ length: 100, nullable: true })
  country?: string;

  @Column({ length: 20, nullable: true })
  postal_code?: string;

  @Column()
  branch_id: number;

  @Column()
  company_id: number;

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
