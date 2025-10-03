import { Branch } from 'src/Company/branch/branch.entity';
import { Company } from 'src/Company/companies/company.entity';
import { Brand } from 'src/procurement/brand/entities/brand.entity';
import { Category } from 'src/procurement/categories/entities/category.entity';
import { UnitOfMeasure } from 'src/procurement/unit_of_measure/entities/unit_of_measure.entity';
import { SalesOrderDetail } from 'src/sales/sales-order/entity/sales-order-detail.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';


@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category_id: number;
  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  brand_id: number;
  @ManyToOne(() => Brand)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @Column()
  uom_id: number;
  @ManyToOne(() => UnitOfMeasure)
  @JoinColumn({ name: 'uom_id' })
  uom: UnitOfMeasure;

  @Column()
  company_id: number;
  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company

  @Column()
  branch_id: number;
  @ManyToOne(() => Branch)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch

  @Column({ length: 50 })
  sku: string;

  @Column({ length: 255 })
  product_name: string;

  @Column({ length: 50, nullable: true })
  product_type?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  unit_price?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  cost_price?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  mrp?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  minimum_stock_level?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  maximum_stock_level?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  reorder_level?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  reorder_quantity?: number;


  @Column({ nullable: true })
  warranty_type?: number;


  @Column({ type: 'int', default: 1 })
  status: number;

  @Column({ length: 50, nullable: true })
  product_status?: string;

  @Column({ length: 50, nullable: true })
  barcode?: string;
  @Column({ type: 'json', nullable: true })
  images: string[];


  @Column({ nullable: true })
  created_by?: number;

  @Column({ type: 'datetime', nullable: true })
  created_date?: Date;

  @Column({ nullable: true })
  updated_by?: number;

  @Column({ type: 'datetime', nullable: true })
  updated_date?: Date;

  // ✅ Relation with SalesOrderDetail
  @OneToMany(() => SalesOrderDetail, (detail) => detail.product, {
    cascade: true,
  })
  salesOrderDetails: SalesOrderDetail[];
}
