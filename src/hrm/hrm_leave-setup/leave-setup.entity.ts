import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Employee } from '../hrm_employee/employee.entity';

@Entity('hrm_leave_setup')
export class Leave {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  total_leave: number;

  @Column()
  leave_remaining: number;

  @Column()
  year: number;

//   @OneToMany(() => Employee, (emp) => emp.leave)
//   employees: Employee[];
}
