import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PurchaseOrder } from './purchase_order.entity';

@Entity('purchase_order_items')
export class PurchaseOrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  purchase_order_id:number
@ManyToOne(() => PurchaseOrder, (po) => po.items, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'purchase_order_id' })
purchaseOrder: PurchaseOrder;


  @Column()
  product_id: number;

  @Column()
  variant_id: number;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  unit_price: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  total_amount: number;

}
