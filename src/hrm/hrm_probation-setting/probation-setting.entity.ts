import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';

@Entity('hrm_probation_settings')
export class ProbationSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', comment: 'Max leave allowed for probation employee' })
  leave_days: number;

  @Column({ type: 'int', comment: 'Probation duration in months' })
  probation_period: number;

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
