import { Branch } from "src/Company/branch/branch.entity";
import { Company } from "src/Company/companies/company.entity";
import { Supplier } from "src/Company/supplier/supplier.entity";
import { PurchaseOrderStatus } from "src/procurement/enums/purchase-order.enum";
import { PurchaseRequest } from "src/procurement/purchase_request/entities/purchase_request.entity";
import { Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, Entity } from "typeorm";
import { PurchaseOrderItem } from "./purchase_order_items.entity";
import { IsDateString } from "class-validator";

@Entity('purchase_orders')
export class PurchaseOrder {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    supplier_id: number;
    @ManyToOne(() => Supplier)
    @JoinColumn({ name: 'supplier_id' })
    supplier: Supplier

    @Column()
    pr_id: number;
    @ManyToOne(() => PurchaseRequest)
    @JoinColumn({ name: 'pr_id' })
    purchaseRequest: PurchaseRequest

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

    // Entity
    @Column({ type: 'date' })
    order_date: string;

    @Column({ type: 'date' })
    expected_delivery_date: string;

    @Column({
        type: 'enum',
        enum: PurchaseOrderStatus,
        default: PurchaseOrderStatus.PENDING, // default value
    })
    po_status: PurchaseOrderStatus;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    total_amount: number;

    @OneToMany(() => PurchaseOrderItem, (item) => item.purchaseOrder, {
        cascade: true,
    })
    items: PurchaseOrderItem[];

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
