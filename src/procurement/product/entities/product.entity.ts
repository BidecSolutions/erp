import { Brand } from 'src/procurement/brand/entities/brand.entity';
import { Category } from 'src/procurement/categories/entities/category.entity';
import { UnitOfMeasure } from 'src/procurement/unit_of_measure/entities/unit_of_measure.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';


@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Brand)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @ManyToOne(() => UnitOfMeasure)
  @JoinColumn({ name: 'uom_id' })
  uom: UnitOfMeasure;

  @Column({ length: 50 })
  sku: string;

  @Column({ length: 50 , unique: true })
  product_code: string;

  @Column({ length: 255  })
  product_name: string;

  @Column({ length: 50, nullable: true })
  product_type?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  specifications?: string;

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

  @Column({ type: 'tinyint', default: 0 })
  is_serialized: number;

  @Column({ type: 'tinyint', default: 0 })
  is_batch_tracked: number;

  @Column({ type: 'tinyint', default: 0 })
  allow_negative_stock: number;

  @Column({ nullable: true })
  warranty_period_days?: number;

  @Column({ length: 50, nullable: true })
  warranty_type?: string;

  @Column({ length: 50, nullable: true })
  hsn_code?: string;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  tax_rate?: number;

  @Column({ type: 'int', default: 1 })
  status: number; 

  @Column({ length: 50, nullable: true })
  product_status?: string;

  @Column({ length: 50, nullable: true })
  barcode?: string;

  @Column({ length: 255, nullable: true })
  product_image_path?: string;

  @Column({ name: 'company_id', nullable: false })
  company_id:number;
  // @ManyToOne(() => Branch)
  // @JoinColumn({name : 'branch_id'})
  // comapany: Comapany

  @Column({ name: 'branch_id', nullable: false })
  branch_id:number;
  // @ManyToOne(() => Branch)
  // @JoinColumn({name : 'branch_id'})
  // branch: Branch
  
  @Column({ nullable: true })
  created_by?: number;

  @Column({ type: 'datetime', nullable: true })
  created_date?: Date;

  @Column({ nullable: true })
  updated_by?: number;

  @Column({ type: 'datetime', nullable: true })
  updated_date?: Date;
}
