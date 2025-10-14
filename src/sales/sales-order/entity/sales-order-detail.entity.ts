
import { Product } from 'src/procurement/product/entities/product.entity';
import { productVariant } from 'src/procurement/product/entities/variant.entity';
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


  @Column()
  variant_id: number;
  @ManyToOne(() => productVariant, (productVariant) => productVariant.salesOrderDetails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'variant_id' })
  productVariant: productVariant;


  @Column({ nullable: false })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  unit_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discount_amount: number;

  // @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  // line_total: number;

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

  // // NEW STATUS & AUDIT COLUMNS
  @Column({
    type: 'int',
    comment: '1 = active, 2 = inactive',
    default: 1
  })
  status: number;

  @Column({ type: 'date', nullable: true })
  created_at: string;

  @Column({ type: 'date', nullable: true })
  updated_at: string;

  @Column({ type: 'int', default: 0 })
  returned_quantity: number;


  @BeforeInsert()
  setDefaults() {
    const now = new Date();
    this.created_at = now.toISOString().split('T')[0];
    this.updated_at = now.toISOString().split('T')[0];
  }
}
