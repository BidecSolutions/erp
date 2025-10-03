import { Supplier } from 'src/Company/supplier/supplier.entity';
import { PurchaseRequest } from 'src/procurement/purchase_request/entities/purchase_request.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { PurchaseQuotationStatus } from 'src/procurement/enums/purchase-quatation.enum';
import { Company } from 'src/Company/companies/company.entity';
import { Branch } from 'src/Company/branch/branch.entity';
import { QuotationItem } from './purchase_quotation_item.entity';


@Entity('purchase_quotations')
export class PurchaseQuotation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    purchase_request_id: number
    @ManyToOne(() => PurchaseRequest, (pr) => pr.id)
    purchase_request: PurchaseRequest;


    @Column({
        type: 'enum',
        enum: PurchaseQuotationStatus,
        default: PurchaseQuotationStatus.PENDING, // default value
    })
    pq_status: PurchaseQuotationStatus;


    @Column({ name: 'supplier_id', nullable: false })
    supplier_id: number
    @ManyToOne(() => Supplier)
    @JoinColumn({ name: 'supplier_id' })
    supplier: Supplier



    @Column({ name: 'company_id', nullable: false })
    company_id: number;
    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    comapany: Company

    @Column({ name: 'branch_id', nullable: false })
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

    @OneToMany(() => QuotationItem, (qi) => qi.purchase_quotation)
quotation_items: QuotationItem[];

}
