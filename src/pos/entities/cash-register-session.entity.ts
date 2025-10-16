import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum CashRegisterStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

@Entity('cash_register_sessions')
export class CashRegisterSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employee_id: number;

  @Column({ nullable: true })
  branch_id: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  opening_balance: number | null;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  closing_balance: number | null;

  @Column({ type: 'timestamp', nullable: true })
  start_date: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  end_date: Date | null;

  @Column({ type: 'enum', enum: CashRegisterStatus, default: CashRegisterStatus.CLOSED })
  status: CashRegisterStatus;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
    