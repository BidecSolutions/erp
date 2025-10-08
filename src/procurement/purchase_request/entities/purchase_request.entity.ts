import { Branch } from "src/Company/branch/branch.entity";
import { Company } from "src/Company/companies/company.entity";
import { PurchaseRequestStatus, PurchaseRequestType } from "src/procurement/enums/purchase-request.enum";
import { PrimaryGeneratedColumn, Column, Entity, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { PurchaseRequestItem } from "./purchase-request-item.entity";

@Entity('purchase_request')
export class PurchaseRequest {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

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

  @OneToMany(() => PurchaseRequestItem, (item) => item.purchase_request)
   items: PurchaseRequestItem[];
  



}


