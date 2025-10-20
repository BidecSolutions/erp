import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { Attendance } from './attendance.entity';

@Entity('hrm_attendance_config')
export class AttendanceConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 10 })
  grace_period_minutes: number;

  @Column({ type: 'int', default: 60 })
  half_day_after_minutes: number;

  @Column({ type: 'int', default: 30 })
  overtime_after_minutes: number;

  @Column({ type: 'simple-array', nullable: true })
  weekends?: string[];

   @Column({
    type: 'int',
    default: 3,
    comment: 'Number of late marks that count as one absence',
  })
  late_to_absent_days: number;

@Column({
  type: 'int',
  default: 30,
  comment: 'Number of days salary is calculated for (e.g., 30 or 22)',
})
daysPerMonth: number;

  @Column({ type: 'int' })
  company_id: number; // 
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

