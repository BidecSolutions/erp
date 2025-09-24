import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Employee } from '../hrm_employee/employee.entity';


@Entity('hrm_mark-attendance')
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, (emp) => emp.markattendance, { eager: true })
  employee: Employee;

  @Column({ type: 'date' })
  date: string;

// @Column()
// clockIn: string;

// @Column()
// clockOut: string;


@Column({ type: 'time', nullable: true })
clockIn: string | null;

@Column({ type: 'time', nullable: true })
clockOut: string | null;


  @Column({ nullable: true })
  status: string; // Present, Absent, Late etc.
  
@Column({ type: 'varchar', length: 10, nullable: true })
late: string | null;

@Column({ type: 'varchar', length: 10, nullable: true })
earlyLeaving: string | null;

@Column({ type: 'varchar', length: 10, nullable: true })
overtime: string | null;


}
