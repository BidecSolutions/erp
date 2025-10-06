import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';


@Entity('hrm_attendance_config')
export class AttendanceConfig {
@PrimaryGeneratedColumn()
id: number;


// Default shift timings (used when employee shift not available)
@Column({ type: 'time' })
office_start_time: string; // e.g. '09:00:00'


@Column({ type: 'time' })
office_end_time: string; // e.g. '18:00:00'


@Column({ type: 'int', default: 10 })
grace_period_minutes: number; // minutes allowed without marking late


@Column({ type: 'int', default: 120 })
half_day_after_minutes: number; // minutes late after which it's considered half-day


@Column({ type: 'int', default: 30 })
overtime_after_minutes: number; // minutes after end time to start overtime


@Column({ type: 'simple-array', nullable: true })
weekly_offs: string[]; // e.g. ['saturday','sunday']

  
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