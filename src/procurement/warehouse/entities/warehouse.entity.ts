import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('warehouses')
export class Warehouse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 , unique:true})
  warehouse_code: string;

  @Column({ length: 255 })
  warehouse_name: string;

  @Column({ length: 50, nullable: true })
  warehouse_type?: string;

  @Column({ length: 255, nullable: true })
  address_line1?: string;

  @Column({ length: 255, nullable: true })
  address_line2?: string;

  @Column({ length: 100, nullable: true })
  city?: string;

  @Column({ length: 100, nullable: true })
  state?: string;

  @Column({ length: 100, nullable: true })
  country?: string;

  @Column({ length: 20, nullable: true })
  postal_code?: string;

  @Column({ nullable: true })
  manager_employee_id?: number;

  @Column({ type: 'tinyint', default: 0 })
  is_default: number;

  @Column({ type: 'int', default: 1 })
  status: number; 

  @Column({ name: 'company_id', nullable: false })
    company_id:number;
    // @ManyToOne(() => Comapany)
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
