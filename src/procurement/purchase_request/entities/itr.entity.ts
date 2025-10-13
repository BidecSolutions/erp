import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from 'src/Company/companies/company.entity';
import { Branch } from 'src/Company/branch/branch.entity';
import { Warehouse } from 'src/procurement/warehouse/entities/warehouse.entity';
import { InternalTransferItem } from './itr.items.entity';
import { ITRStatus } from 'src/procurement/enums/itr-enum';



@Entity('internal_transfer_requests')
export class InternalTransferRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  itr_code: string;

  @Column()
  from_warehouse_id: number;
  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'from_warehouse_id' })
  fromWarehouse: Warehouse;

  @Column()
  to_warehouse_id: number;
  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'to_warehouse_id' })
  toWarehouse: Warehouse;

  @Column({
    type: 'enum',
    enum: ITRStatus,
    default: ITRStatus.PENDING,
  })
  status: ITRStatus;

  @Column({ type: 'text', nullable: true })
  remarks?: string;

  @Column()
  company_id: number;
  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column()
  branch_id: number;
  @ManyToOne(() => Branch)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @Column({ nullable: true })
  created_by?: number;

  @Column({ nullable: true })
  approved_by?: number;

  @Column({ type: 'timestamp', nullable: true })
  approved_date?: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  user_id:number;

  // Relations
  @OneToMany(() => InternalTransferItem, (item) => item.itr, { cascade: true })
  items: InternalTransferItem[];
}
