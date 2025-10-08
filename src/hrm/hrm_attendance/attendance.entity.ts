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

  @ManyToOne(() => Employee, { nullable: false })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time', nullable: true })
  check_in?: string;

  @Column({ type: 'time', nullable: true })
  check_out?: string;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.ABSENT,
  })
  attendance_status: AttendanceStatus;

  @Column({ type: 'int', nullable: true })
  late_minutes?: number;

  @Column({ type: 'int', nullable: true })
  overtime_minutes?: number;

  @Column({ type: 'int', nullable: true })
  work_duration_minutes?: number;

  @ManyToOne(() => AttendanceConfig, (config) => config.attendances, {
    nullable: true,
  })
  @JoinColumn({ name: 'config_id' })
  config: AttendanceConfig;

  
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
