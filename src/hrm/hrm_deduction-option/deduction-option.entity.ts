import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('hrm_deduction_options')
export class DeductionOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}
