import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
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

  @Column({ nullable: true })
  created_by: number;

  @Column({ type: 'date' })
  created_date: string;
}
