import { IsIn, IsString } from 'class-validator';
import { Company } from 'src/Company/companies/company.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, ManyToOne, JoinColumn } from 'typeorm';

@Entity('hrm_probation_settings')
export class ProbationSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', comment: 'Max leave allowed for probation employee' })
  leave_days: number;

  @Column({ type: 'int'})
  probation_period: number;

@Column({ type: 'varchar', length: 20, default: 'months' })
@IsString()
@IsIn(['days', 'months'], { message: 'Duration type must be days or months' })
duration_type: 'days' | 'months';

  @ManyToOne(() => Company, { eager: true }) // eager true -> auto load
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column()
  company_id: number;

   @Column({
             type: 'int',
            comment: '0 = inactive, 1 = active',
             default: 1
         })
         status: number;

           
           @Column({ name: "created_by", nullable: true })
           created_by: number;
         
           @Column({ name: "updated_by", nullable: true })
           updated_by: number;
     
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
