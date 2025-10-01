import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PurchaseRequest } from './purchase_request.entity';
import { Branch } from 'src/Company/branch/branch.entity';
import { Company } from 'src/Company/companies/company.entity';
import { Product } from 'src/procurement/product/entities/product.entity';
import { productVariant } from 'src/procurement/product/entities/variant.entity';

@Entity('purchase_request_items')
export class PurchaseRequestItem {
    @PrimaryGeneratedColumn()
    id: number;

    //   @ManyToOne(() => PurchaseRequest, (pr) => pr.items)
    //   purchase_request: PurchaseRequest;

    @Column()
    pr_id: number
    @ManyToOne(() => PurchaseRequest)
    @JoinColumn({ name: 'pr_id' })
    purchase_request: PurchaseRequest;

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

    @Column('int')
    qty_requested: number;

    @Column()
    company_id: number;
    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    comapany: Company

    @Column()
    branch_id: number;
    @ManyToOne(() => Branch)
    @JoinColumn({ name: 'branch_id' })
    branch: Branch


    @Column({ type: 'int', default: 1 })
    status: number;

    @Column({ name: 'created_by', type: 'int', nullable: true })
    created_by?: number;

    @CreateDateColumn({ name: 'created_date', type: 'timestamp' })
    created_date: Date;

    @Column({ name: 'updated_by', type: 'int', nullable: true })
    updated_by?: number;

    @UpdateDateColumn({ name: 'updated_date', type: 'timestamp', nullable: true })
    updated_date?: Date;

}
