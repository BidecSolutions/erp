import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('unit_of_measures')
export class UnitOfMeasure {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'uom_code', type: 'varchar', length: 50, unique: true })
  uom_code: string;

  @Column({ name: 'uom_name', type: 'varchar', length: 100 })
  uom_name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'status', type: 'tinyint', default: 1 })
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
