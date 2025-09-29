import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { Employee } from '../hrm_employee/employee.entity';
import { LeaveType } from '../hrm_leave-type/leave-type.entity';

export enum LeaveStatus {
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3,
}

@Entity('hrm_leave_request')
export class LeaveRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, (emp) => emp.leaveRequests, { eager: true })
  employee: Employee;

  @ManyToOne(() => LeaveType, (lt) => lt.leaveRequests, { eager: true })
  leaveType: LeaveType;

  @Column()
  number_of_leave: number;

  @Column()
  description: string;

  @Column({ type: 'date' })
  start_date: string;

  @Column({ type: 'date' })
  end_date: string;

  @Column({
    type: 'int',
     comment: '1 = pending, 2 = approved, 3 = reject',
    default: LeaveStatus.PENDING,
  })
  leave_status: LeaveStatus; 

  @Column({
               type: 'int',
               comment: '1 = active, 2 = inactive',
               default: 1
           })
           status: number;
       
           @Column({ type: 'date' })
           created_at: string;
       
           @Column({ type: 'date' })
           updated_at: string;
       
           @BeforeInsert()
           setDefaults() {
               const now = new Date();
               this.created_at = now.toISOString().split('T')[0];
               this.updated_at = now.toISOString().split('T')[0];
           }
}
