import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { PurchaseQuotation } from './purchase_quotation.entity';
import { Product } from 'src/procurement/product/entities/product.entity';
import { productVariant } from 'src/procurement/product/entities/variant.entity';
import { Supplier } from 'src/Company/supplier/supplier.entity';
import { PurchaseQuotationStatus } from 'src/procurement/enums/purchase-quatation.enum';

@Entity('purchase_quotation_items')
export class QuotationItem {
    @PrimaryGeneratedColumn()
    id: number;


    @Column()
    purchase_quotation_id: number
    @ManyToOne(() => PurchaseQuotation)
    @JoinColumn({ name: 'purchase_quotation_id' })
    purchase_quotation: PurchaseQuotation;



    @Column({ name: 'product_id' })
    product_id: number;
    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ name: 'variant_id' })
    variant_id: number;
    @ManyToOne(() => productVariant)
    @JoinColumn({ name: 'variant_id' })
    variant: productVariant;

    @Column()
    supplier_id: number
    @ManyToOne(() => Supplier)
    @JoinColumn({ name: 'supplier_id' })
    supplier: Supplier;


    @Column('int')
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    unit_price: number;


    @Column({ nullable: true })
    delivery_days: number;

    @Column({ type: 'int', default: 1 })
    status: number;

}
