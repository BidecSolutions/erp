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

    @Column({ type: 'json', nullable: true })
    images: string[];

    @Column({ name: 'created_by', type: 'int', nullable: true })
    created_by?: number;

    @CreateDateColumn({ name: 'created_date', type: 'timestamp' })
    created_date: Date;

    @Column({ name: 'updated_by', type: 'int', nullable: true })
    updated_by?: number;

    @UpdateDateColumn({ name: 'updated_date', type: 'timestamp', nullable: true })
    updated_date?: Date;

    @OneToMany(() => SalesOrderDetail, (detail) => detail.productVariant, {
        cascade: true,
    })
    salesOrderDetails: SalesOrderDetail[];

}