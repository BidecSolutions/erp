import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SupplierInvoice } from './supplier-invoice.entity';
import { Product } from 'src/procurement/product/entities/product.entity';
import { productVariant } from 'src/procurement/product/entities/variant.entity';

@Entity('supplier_invoice_items')
export class SupplierInvoiceItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  invoice_id: number;
  @ManyToOne(() => SupplierInvoice)
  @JoinColumn({ name: 'invoice_id' })
  invoice: SupplierInvoice;

  @Column()
  product_id: number;
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ nullable: true })
  variant_id: number;
  @ManyToOne(() => productVariant)
  @JoinColumn({ name: 'variant_id' })
  variant: productVariant;


  @Column({ type: 'decimal', precision: 12, scale: 2 })
  unit_price: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  total_price: number;

  @Column()
  ordered_qty: number;
  @Column()
  received_qty: number;
  @Column()
  accept_qty: number;
  @Column()
  reject_qty: number;

}
