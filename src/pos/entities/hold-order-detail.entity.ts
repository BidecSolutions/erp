import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { productVariant } from 'src/procurement/product/entities/variant.entity';
import { Product } from 'src/procurement/product/entities/product.entity';
import { HoldOrder } from './hold-order.entity';

@Entity('hold_order_details')
export class HoldOrderDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => HoldOrder, (order) => order.holdOrderDetails, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hold_order_id' })
  holdOrder: HoldOrder;

  @ManyToOne(() => Product, { nullable: false, eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => productVariant, { nullable: true, eager: true })
  @JoinColumn({ name: 'product_variant_id' })
  productVariant: productVariant;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  unit_price: number;

  @Column({ type: 'int', nullable: false })
  quantity: number;
}
