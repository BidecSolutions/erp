import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, BeforeInsert } from 'typeorm';
import { Company } from '../companies/company.entity';
import { Supplier } from '../supplier/supplier.entity';

@Entity('supplier_categories')
export class SupplierCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Company, (company) => company.supplierCategories, {
    onDelete: 'CASCADE',
  })
  company: Company;

  // One category has many suppliers
  @OneToMany(() => Supplier, (supplier) => supplier.category)
  suppliers: Supplier[];

  @Column()
  category_code: string;

  @Column()
  category_name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'smallint', default: 1, comment: '1 = active, 2 = inactive' })
  is_active: number;

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
