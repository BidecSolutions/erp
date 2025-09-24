import { Product } from 'src/procurement/product/entities/product.entity';
import { Warehouse } from 'src/procurement/warehouse/entities/warehouse.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('inventory_stock')
export class Stock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Warehouse, { eager: true })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({ type: 'int', default: 0 })
  quantity_on_hand: number;

  @Column({ type: 'int', default: 0 })
  reorder_level: number;

  @Column({ type: 'int', default: 0 })
  reorder_quantity: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
      @Column({ type: 'int', default: 1 })
  status: number; 


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

 @Column({ name: 'created_by', type: 'int', nullable: true })
  created_by?: number;

  @CreateDateColumn({ name: 'created_date', type: 'timestamp' })
  created_date: Date;

  @Column({ name: 'updated_by', type: 'int', nullable: true })
  updated_by?: number;

  @UpdateDateColumn({ name: 'updated_date', type: 'timestamp', nullable: true })
  updated_date?: Date;





}
