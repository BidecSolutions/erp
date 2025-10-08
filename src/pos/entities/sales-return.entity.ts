import { Branch } from 'src/Company/branch/branch.entity';
import { Company } from 'src/Company/companies/company.entity';
import { Customer } from 'src/Company/customers/customer.entity';
import { SalesOrder } from 'src/sales/sales-order/entity/sales-order.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    BeforeInsert,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { SalesReturnDetail } from './sales-return-detail.entity';

@Entity()
export class SalesReturn {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    return_no: string;

    @Column('decimal', { precision: 10, scale: 2 })
    total_return_amount: number;

    @ManyToOne(() => SalesOrder, (order) => order.salesReturns, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn({ name: 'sales_order_id' })
    salesOrder: SalesOrder;

    @ManyToOne(() => Company, (company) => company.salesReturns, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @ManyToOne(() => Branch, (branch) => branch.salesReturns, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn({ name: 'branch_id' })
    branch?: Branch;

    @ManyToOne(() => Customer, (customer) => customer.salesReturns, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn({ name: 'customer_id' })
    customer?: Customer;

    @OneToMany(() => SalesReturnDetail, (detail) => detail.salesReturn, {
        cascade: true,
    })
    details: SalesReturnDetail[];

    @Column({ type: 'date' })
    return_date: Date;

    // @Column({ nullable: true })
    // created_by: number;

    @Column({ type: 'date' })
    created_date: string;


    @Column({ type: 'date', nullable: true })
    updated_date: string;

    @BeforeInsert()
    setCreateDate() {
        const today = new Date().toISOString().split('T')[0];
        this.created_date = today;
        this.updated_date = today;
    }
}
