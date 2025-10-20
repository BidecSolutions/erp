import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('hrm_payroll')
export class Payroll {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employee_id: number;

  @Column()
  month: number;

  @Column()
  year: number;

  @Column('decimal', { precision: 10, scale: 2 })
  salary: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total_work_hours: number;

  @Column('decimal', { precision: 10, scale: 2 })
  worked_hours: number;

  @Column('decimal', { precision: 10, scale: 2 })
  late_hours: number;

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
