import { po_status } from "src/procurement/common/po_enums";
import { Column, PrimaryGeneratedColumn ,CreateDateColumn , UpdateDateColumn} from "typeorm";

export class PurchaseOrder {

    @PrimaryGeneratedColumn()
    id:number;

   @Column()
   supplier_id :number; // relation

   @Column()
   pr_id:number //realtion

   @Column( {type :'date'})
   order_date:string;

   @Column( {type :'date'})
   expected_delivery_date:string

    @Column({
    type: 'enum',
    enum: po_status,
    default: po_status.Draft, // default value
    })
    status: po_status;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    total_amount: number;

    @CreateDateColumn({ type: 'date' })
    created_at: string;

    @UpdateDateColumn({ type: 'date' })
    updated_at: string;

   


}
