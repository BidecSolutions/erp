import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PurchaseGrn } from './goods_receiving_note.entity';
import { grnStatus } from 'src/procurement/enums/grn-enum';

@Entity('purchase_grn_items')
export class PurchaseGrnItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  grn_id: number;

  @ManyToOne(() => PurchaseGrn, (grn) => grn.items)
  @JoinColumn({ name: 'grn_id' })
  purchaseGrn: PurchaseGrn;

  @Column()
  product_id: number;

  @Column()
  variant_id: number;

  @Column()
  received_quantity: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  unit_price: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  total_price: number;

  @Column({ nullable: true })
  remarks: string;

  @Column({
    type: 'enum',
    enum: grnStatus,
  })
  grn_status: grnStatus;
}
