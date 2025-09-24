import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert } from 'typeorm';
import { AllowanceOption } from '../hrm_allowance-option/allowance-option.entity';


export enum AllowanceType {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage',
}

@Entity('hrm_allowances')
export class Allowance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AllowanceOption, { eager: true })
  @JoinColumn({ name: 'allowanceOptionId' })
  allowanceOption: AllowanceOption;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: AllowanceType })
  type: AllowanceType;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

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
