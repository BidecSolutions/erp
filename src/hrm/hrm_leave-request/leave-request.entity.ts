import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeInsert,
  JoinColumn,
} from 'typeorm';
import { Employee } from '../hrm_employee/employee.entity';
import { LeaveType } from '../hrm_leave-type/leave-type.entity';
import { AnnualLeave } from '../hrm_annual-leave/annual-leave.entity';

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
    default: LeaveStatus.PENDING,
    comment: '1=pending, 2=approved, 3=rejected',
  })
  leave_status: LeaveStatus;
  
//   @ManyToOne(() => AnnualLeave, (annualLeave) => annualLeave.employees)
// @JoinColumn({ name: 'annual_leave_id' })
// annualLeave: AnnualLeave;

  @Column({
               type: 'int',
             comment: '0 = inactive, 1 = active',
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
