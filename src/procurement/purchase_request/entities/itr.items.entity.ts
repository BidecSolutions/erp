import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from 'src/procurement/product/entities/product.entity';
import { productVariant } from 'src/procurement/product/entities/variant.entity';
import { InternalTransferRequest } from './itr.entity';

export enum ITRItemStatus {
  PENDING = 'pending',
  DISPATCH = 'dispatch',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('internal_transfer_items')
export class InternalTransferItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  itr_id: number;
  @ManyToOne(() => InternalTransferRequest, (itr) => itr.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'itr_id' })
  itr: InternalTransferRequest;

  @Column()
  product_id: number;
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  variant_id: number;
  @ManyToOne(() => productVariant)
  @JoinColumn({ name: 'variant_id' })
  variant: productVariant;

  @Column({ type: 'int' })
  requested_qty: number;

  @Column({ type: 'int', default: 0 })
  approved_qty: number;

  @Column({
    type: 'enum',
    enum: ITRItemStatus,
    default: ITRItemStatus.PENDING,
  })
  status: ITRItemStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
