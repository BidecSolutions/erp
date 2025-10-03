import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from "typeorm";
import { Employee } from "../hrm_employee/employee.entity";

export enum LoanStatus {
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3,
}

@Entity("hrm_loan_request")
export class LoanRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: "emp_id" })
  employee: Employee;

  @Column()
  emp_id: number;

  @Column("decimal", { precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  description: string;

  @Column({ type: "int", default: LoanStatus.PENDING, comment: '1=pending, 2=approved, 3=rejected', })
  loan_status: LoanStatus;

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
