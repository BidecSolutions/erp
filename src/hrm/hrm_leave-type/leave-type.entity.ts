import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany } from 'typeorm';
import { LeaveRequest } from '../hrm_leave-request/leave-request.entity';

@Entity('hrm_leave_type')
export class LeaveType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  leave_type: string;

  
    @OneToMany(() => LeaveRequest, (leaveRequest) => leaveRequest.employee)
    leaveRequests: LeaveRequest[];

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
