import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { Employee } from '../hrm_employee/employee.entity';
import { AttendanceConfig } from './attendance-config.entity';

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  HALF_DAY = 'HALF_DAY',
  LEAVE = 'LEAVE',
  WEEKEND = 'WEEKEND',
  HOLIDAY = 'HOLIDAY',
}

@Entity('hrm_attendance')
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  employee_id: number;
  
  @Column({ type: 'int' })
  company_id: number; 

  @Column({ type: 'date' })
  date: string;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.ABSENT,
  })
  attendance_status: AttendanceStatus;

 @Column({ type: 'time', nullable: true })
check_in?: string | null;

@Column({ type: 'time', nullable: true })
check_out?: string | null;

@Column({ type: 'int', nullable: true })
late_minutes?: number | null;

@Column({ type: 'int', nullable: true })
overtime_minutes?: number | null;

@Column({ type: 'int', nullable: true })
work_duration_minutes?: number | null;

@Column({ type: 'int', nullable: true })
config_id?: number | null;

  
   @Column({
     type: 'int',
     comment: '0 = inactive, 1 = active',
     default: 1,
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
