import { Branch } from 'src/Company/branch/branch.entity';
import { Company } from 'src/Company/companies/company.entity';
import { Product } from 'src/procurement/product/entities/product.entity';
import { productVariant } from 'src/procurement/product/entities/variant.entity';
import { Warehouse } from 'src/procurement/warehouse/entities/warehouse.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';

@Entity('inventory_stock')
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  product_id: number;
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'int', nullable: true })
  variant_id: number
  @ManyToOne(() => productVariant, { nullable: true })
  @JoinColumn({ name: 'variant_id' })
  variant: productVariant;

  @Column()
  warehouse_id: number;
  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse


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

  @Column({ type: 'int', default: 0 })
  quantity_on_hand: number;

  @Column({ type: 'int', default: 0 })
  alert_qty: number;

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
