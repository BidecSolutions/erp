import { PrimaryGeneratedColumn, Entity, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Product } from "./product.entity";
import { Branch } from "src/Company/branch/branch.entity";
import { Company } from "src/Company/companies/company.entity";
import { SalesOrderDetail } from "src/sales/sales-order/entity/sales-order-detail.entity";

@Entity('variants')
export class productVariant {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    product_id: number
    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column()
    variant_name: string;

    @Column()
    variant_code: string;

    @Column()
    attribute_name: string;

    @Column()
    attribute_value: string;

    @Column({ type: 'int', default: 1 })
    status: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    unit_price?: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    cost_price?: number;

    @OneToMany(() => SalesOrderDetail, (detail) => detail.productVariant, {
        cascade: true,
    })
    salesOrderDetails: SalesOrderDetail[];

}