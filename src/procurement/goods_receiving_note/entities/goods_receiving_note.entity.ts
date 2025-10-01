import { PurchaseOrder } from 'src/procurement/purchase_order/entities/purchase_order.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { PurchaseGrnItem } from './goods_receiving_note-item.entity';

@Entity('purchase_grn')
export class PurchaseGrn {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    po_id: number;
    @ManyToOne(() => PurchaseOrder)
    @JoinColumn({ name: 'po_id' })
    purchaseOrder: PurchaseOrder;

    @Column()
    grn_date: Date;

    @Column({ nullable: true })
    remarks: string;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    total_received_amount: number;

    @Column({ default: 'pending' })
    grn_status: string;

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

    @OneToMany(() => PurchaseGrnItem, (item) => item.purchaseGrn, {
        cascade: true,
    })
    items: PurchaseGrnItem[];
}
