import { Branch } from 'src/Company/branch/branch.entity';
import { Company } from 'src/Company/companies/company.entity';
import { MovementType } from 'src/procurement/enums/stock-movement.enum';
import { Product } from 'src/procurement/product/entities/product.entity';
import { Warehouse } from 'src/procurement/warehouse/entities/warehouse.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';


@Entity('stock_movements')
export class StockMovement {
  @PrimaryGeneratedColumn()
  id: number;


  @Column()
  product_id: number;
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ nullable: true })
  from_warehouse_id: number;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'from_warehouse_id' })
  fromWarehouse: Warehouse;

  @Column({ nullable: true })
  to_warehouse_id: number;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'to_warehouse_id' })
  toWarehouse: Warehouse;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  reference_type: string;   // e.g. PO, SALE, RETURN

  @Column({
    type: 'enum',
    enum: MovementType,
    default: MovementType.PENDING, // default value
  })
  movement_type: MovementType;

  @Column({ type: 'varchar', length: 100, nullable: true })
  reference_number: string;

  @Column({ name: 'company_id', nullable: false })
  company_id: number;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'branch_id', nullable: false })
  branch_id: number;

  @ManyToOne(() => Branch)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @Column({ name: 'created_by', type: 'int', nullable: true })
  created_by?: number;

  @CreateDateColumn({ name: 'created_date', type: 'timestamp' })
  created_date: Date;

  @Column({ name: 'updated_by', type: 'int', nullable: true })
  updated_by?: number;

  @UpdateDateColumn({ name: 'updated_date', type: 'timestamp', nullable: true })
  updated_date?: Date;


  @Column({ type: 'int', default: 1 })
  status: number;
}
