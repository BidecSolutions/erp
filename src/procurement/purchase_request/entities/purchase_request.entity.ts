import { Branch } from "src/Company/branch/branch.entity";
import { Company } from "src/Company/companies/company.entity";
import { PurchaseRequestStatus, PurchaseRequestType } from "src/procurement/enums/purchase-request.enum";
import { PrimaryGeneratedColumn, Column, Entity, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, BeforeInsert } from "typeorm";
import { PurchaseRequestItem } from "./purchase-request-item.entity";

@Entity('purchase_request')
export class PurchaseRequest {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: PurchaseRequestType,
  })
  pr_type: PurchaseRequestType;

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

  @Column({
    type: 'enum',
    enum: PurchaseRequestStatus,
    default: PurchaseRequestStatus.PENDING, // default value
  })
  pr_status: PurchaseRequestStatus;

  @Column()
  remarks: string;

  @Column()
  module_type: number


  @Column({ name: 'status', type: 'tinyint', default: 1 })
  status: number;
  
 @Column({ nullable: true })
   approved_by?: number;
 
   @Column({ type: 'date', nullable: true })
   approved_date?: string;
 
   @Column({ nullable: true })
   created_by: number;
 
   @Column({ nullable: true })
   updated_by: number;
 
   @Column({ type: 'date', nullable: true })
   created_at: string;
 
   @Column()
   updated_at: string;
 
   @BeforeInsert()
   setDefaults() {
     const now = new Date();
     this.created_at = now.toISOString().split('T')[0];
     this.updated_at = now.toISOString().split('T')[0];
     this.approved_date = now.toISOString().split('T')[0];
   }

  @OneToMany(() => PurchaseRequestItem, (item) => item.purchase_request)
   items: PurchaseRequestItem[];
  



}


