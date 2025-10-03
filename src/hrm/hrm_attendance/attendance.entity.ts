import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Unique, BeforeInsert } from 'typeorm';
import { Employee } from '../../hrm/hrm_employee/employee.entity';


export enum AttendanceStatus {
PRESENT = 'PRESENT',
ABSENT = 'ABSENT',
HALF_DAY = 'HALF_DAY',
LEAVE = 'LEAVE',
WEEKEND = 'WEEKEND',
HOLIDAY = 'HOLIDAY',
}


@Entity('hrm_attendance')
@Unique(['employee', 'date'])
export class Attendance {
@PrimaryGeneratedColumn()
id: number;


@ManyToOne(() => Employee, { nullable: false })
employee: Employee;


@Column({ type: 'date' })
date: string; // YYYY-MM-DD


@Column({ type: 'time', nullable: true })
check_in: string | null;


@Column({ type: 'time', nullable: true })
check_out: string | null;


@Column({ type: 'enum', enum: AttendanceStatus, default: AttendanceStatus.ABSENT })
attendance_status: AttendanceStatus;


@Column({ type: 'int', default: 0 })
late_minutes: number;


@Column({ type: 'int', default: 0 })
overtime_minutes: number;


@Column({ type: 'int', default: 0 })
work_duration_minutes: number; // check_out - check_in in minutes



     @Column({
              type: 'int',
              comment: '0 = inactive 1 = active',
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