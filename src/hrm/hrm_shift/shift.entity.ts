import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Employee } from '../hrm_employee/employee.entity';

@Entity('hrm_shift')
export class Shift {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

   @OneToMany(() => Employee, (emp) => emp.shift)
  employees: Employee[];
}
