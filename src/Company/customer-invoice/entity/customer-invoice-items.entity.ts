import { SalesOrder } from "src/sales/sales-order/entity/sales-order.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CustomerInvoice } from "./customer-invoice.entity";

@Entity('customer_invoice_items')
export class customer_invoice_items {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    customer_invoice_id: number; 

    @Column()
    product_id: number;

    @Column()
    variant_id: number;

    @Column()
    quantity: number;

    @Column()
    unit_price: number;

    @Column()
    total_price: number;

    @ManyToOne(() => CustomerInvoice, (invoice) => invoice.invoiceItems, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'customer_invoice_id' })
    customerInvoice: CustomerInvoice;






}