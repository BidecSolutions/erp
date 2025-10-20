import { Employee } from 'src/hrm/hrm_employee/employee.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert } from 'typeorm';

@Entity('hrm_payroll')
export class Payroll {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ type: 'int' })
  employee_id: number;

  @Column({ type: 'int' })
  month: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_work_hours: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  worked_hours: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  late_hours: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  salary: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  allowance_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  loan_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  unpaid_leave_deduction: number;

  @Column({
    type: "int",
    comment: "0 = inactive, 1 = active",
    default: 1,
  })
  status: number;

  @Column({ type: "date" })
  created_at: string;

  @Column({ type: "date" })
  updated_at: string;

  @BeforeInsert()
  setDefaults() {
    const now = new Date();
    this.created_at = now.toISOString().split("T")[0];
    this.updated_at = now.toISOString().split("T")[0];
  }
}
