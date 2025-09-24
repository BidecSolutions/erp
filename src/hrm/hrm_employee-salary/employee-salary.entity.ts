import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Paysliptype } from "src/hrm/hrm_paysliptype/paysliptype.entity";
import { Account } from "src/hrm/hrm_account/account.entity";

@Entity('hrm_employee_salaries')
export class EmployeeSalary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  salary: number;

  // Relation with PayslipType (column name = payslipType)
  @ManyToOne(() => Paysliptype, { eager: true })
  @JoinColumn({ name: 'payslipType' })
  payslipType: Paysliptype;

  // Relation with Account (column name = accountType)
  @ManyToOne(() => Account, { eager: true })
  @JoinColumn({ name: 'accountType' })
  accountType: Account;
}
