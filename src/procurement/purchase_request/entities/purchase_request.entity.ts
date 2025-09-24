import { pr_status } from "src/procurement/common/pr_enums";
import { PrimaryGeneratedColumn ,Column ,Entity ,CreateDateColumn , UpdateDateColumn} from "typeorm";


@Entity('pro_purchase_request')
export class PurchaseRequest {

   @PrimaryGeneratedColumn()
    id :number;

    @Column()
    user_id: number;

    @Column()
    pr_type : number //local , imported

    @Column()
    location: string //store_location

    @Column({
    type: 'enum',
    enum: pr_status,
    default: pr_status.Draft, // default value
    })
    status: pr_status;

    @Column()
    remarks:string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;


}


