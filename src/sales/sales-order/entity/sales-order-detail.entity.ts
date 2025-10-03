
import { Product } from 'src/procurement/product/entities/product.entity';
import { SalesOrder } from 'src/sales/sales-order/entity/sales-order.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';


@Entity('sales_order_details')
export class SalesOrderDetail {
  @PrimaryGeneratedColumn()
  id: number;


 @ManyToOne(() => SalesOrder, (order) => order.salesOrderDetails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })  // 👈 order_id column generate hoga
  salesOrder: SalesOrder;            // 👈 single relation rakho





  @Column()
  product_id: number;
  @ManyToOne(() => Product, (product) => product.salesOrderDetails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: false })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  unit_price: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  discount_percent: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discount_amount: number;

  // @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  // line_total: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  tax_rate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  tax_amount: number;

  @Column({ type: 'date', nullable: true })
  required_date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  delivered_quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  pending_quantity: number;

  @Column({ length: 50, default: 'pending' })
  line_status: string;

  @Column({ nullable: true })
  line_order: number;

  // ✅ NEW STATUS & AUDIT COLUMNS
  @Column({
    type: 'smallint',
    default: 1,
    nullable: false,
    comment: '0 = inactive, 1 = active',
  })
  status: number;

  @Column({ type: 'date', nullable: true })
  created_at: string;

  @Column({ type: 'date', nullable: true })
  updated_at: string;


  @BeforeInsert()
  setCreateDateParts() {
    const today = new Date();
    const onlyDate = today.toISOString().split('T')[0]; // YYYY-MM-DD
    this.created_at = onlyDate;
    this.updated_at = onlyDate;
  }
}
