import { PrimaryGeneratedColumn ,Column ,Entity ,CreateDateColumn , UpdateDateColumn} from "typeorm";

export class PurchaseRequestItem {
   @PrimaryGeneratedColumn()
    id :number;

    @Column()
    pr_id: number; // purchase_request_id

    @Column()
    product_id:number;  // relation

    @Column()
    category_id:number; //relation

    @Column()
    qty_in_unit :number

    @Column( {type : 'date'})
    requied_date:string

    @Column()
    remarks:string;

    @CreateDateColumn({ type: 'date' })
    created_at: string;

    @UpdateDateColumn({ type: 'date' })
    updated_at: string;
    
    @Column({ type: 'int', default: 1 })
    status: number; //1 active 0 in-active

}
