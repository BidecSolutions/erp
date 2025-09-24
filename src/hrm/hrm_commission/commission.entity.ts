import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('hrm_commissions')
export class Commission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: ['fixed', 'percentage', 'period'],
  })
  type: 'fixed' | 'percentage' | 'period';

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column({
    type: 'enum',
    enum: ['active', 'expired'],
  })
  status: 'active' | 'expired';
}
