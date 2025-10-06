import { Branch } from 'src/Company/branch/branch.entity';
import { Company } from 'src/Company/companies/company.entity';
import { Product } from 'src/procurement/product/entities/product.entity';
import { productVariant } from 'src/procurement/product/entities/variant.entity';
import { Warehouse } from 'src/procurement/warehouse/entities/warehouse.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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
  variant_id?: number | null;

  @ManyToOne(() => productVariant, { nullable: true })
  @JoinColumn({ name: 'variant_id' })
  variant?: productVariant | null;

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

  @Column({ type: 'int', default: 1 })
  status: number;

  @Column({ name: 'created_by', type: 'int', nullable: true })
  created_by?: number;

  @CreateDateColumn({ name: 'created_date', type: 'timestamp' })
  created_date: Date;

  @Column({ name: 'updated_by', type: 'int', nullable: true })
  updated_by?: number;

  @UpdateDateColumn({ name: 'updated_date', type: 'timestamp', nullable: true })
  updated_date?: Date;





}
