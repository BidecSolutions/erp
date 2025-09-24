import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { LoanOption } from 'src/hrm/hrm_loan-option/loan-option.entity';

@Entity('hrm_loan')
export class Loan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => LoanOption, { eager: true })
  @JoinColumn()
  loanOption: LoanOption;

  @Column({ type: 'enum', enum: ['fixed', 'percentage'] })
  type: string;

  @Column('decimal', { precision: 10, scale: 2 })
  loanAmount: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'text' })
  reason: string;
}
