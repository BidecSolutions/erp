import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Department } from '../hrm_department/department.entity';


@Entity('hrm_designations')
export class Designation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Relation with Department
  @ManyToOne(() => Department, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'department_id' })
  department: Department;
}
