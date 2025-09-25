import { PrimaryGeneratedColumn ,Entity, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity('variants')
export class productVariant {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    product_id:number
    @ManyToOne(() => Product)
    @JoinColumn({name : 'product_id'})
    product: Product;

    @Column()
    variant_name:string;

    @Column( )
    variant_code :string;

    @Column()
    attribute_name :string;

    @Column()
    attribute_value: string;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    price_difference:number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    cost_difference:number;

    @Column({ type: 'int', default: 1 })
     status: number; 


    @Column({ name: 'company_id', nullable: false })
    company_id:number;
    // @ManyToOne(() => Branch)
    // @JoinColumn({name : 'branch_id'})
    // comapany: Comapany

    @Column({ name: 'branch_id', nullable: false })
    branch_id:number;
    // @ManyToOne(() => Branch)
    // @JoinColumn({name : 'branch_id'})
    // branch: Branch

    @Column({ name: 'created_by', type: 'int', nullable: true })
    created_by?: number;

    @CreateDateColumn({ name: 'created_date', type: 'timestamp' })
    created_date: Date;

    @Column({ name: 'updated_by', type: 'int', nullable: true })
    updated_by?: number;

    @UpdateDateColumn({ name: 'updated_date', type: 'timestamp', nullable: true })
    updated_date?: Date;
    
}