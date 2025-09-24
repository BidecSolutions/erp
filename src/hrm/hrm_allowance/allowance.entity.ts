import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
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
}
