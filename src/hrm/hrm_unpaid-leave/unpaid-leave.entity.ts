import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert } from 'typeorm';
import { Employee } from '../hrm_employee/employee.entity';
import { LeaveRequest } from '../hrm_leave-request/leave-request.entity';

@Entity('hrm_unpaid_leave')
export class UnpaidLeave {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'emp_id' })
  employee: Employee;

  @ManyToOne(() => LeaveRequest)
  @JoinColumn({ name: 'leave_request_id' })
  leaveRequest: LeaveRequest;

  @Column({ type: 'int' })
  extra_days: number; 

    
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
