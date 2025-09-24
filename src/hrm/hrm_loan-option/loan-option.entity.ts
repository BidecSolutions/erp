import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('hrm_loan_options')
export class LoanOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}
