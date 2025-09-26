import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from 'src/procurement/product/entities/product.entity';
import { Warehouse } from 'src/procurement/warehouse/entities/warehouse.entity';
import { AdjustmentReason, AdjustmentType } from 'src/procurement/enums/stock-adjustments.enum';
import { Company } from 'src/Company/companies/company.entity';
import { Branch } from 'src/Company/branch/branch.entity';

@Entity('stock_adjustments')
export class StockAdjustment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @ManyToOne(() => Warehouse)
    @JoinColumn({ name: 'warehouse_id' })
    warehouse: Warehouse;

    @Column({ type: 'int' })
    quantity: number;

    @Column({
        type: 'enum',
        enum: AdjustmentType,
    })
    adjustment_type: AdjustmentType;

    @Column({
        type: 'enum',
        enum: AdjustmentReason,
    })
    reason: AdjustmentType;


    @Column({ type: 'int', default: 1 })
    status: number;


    @Column({ name: 'company_id', nullable: false })
    company_id: number;
    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    comapany: Company

    @Column({ name: 'branch_id', nullable: false })
    branch_id: number;
    @ManyToOne(() => Branch)
    @JoinColumn({ name: 'branch_id' })
    branch: Branch

    @Column({ type: 'date' })
    created_at: string;

    @Column()
    created_by?: number;

    @Column({ type: 'date' })
    updated_at: string;

    @Column()
    updated_by?: number;





}
