import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('hrm_company_contributions')
export class CompanyContribution {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: ['fixed', 'percentage'] })
  type: 'fixed' | 'percentage';

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;
}
