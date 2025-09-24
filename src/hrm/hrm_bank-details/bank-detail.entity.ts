import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from '../hrm_employee/employee.entity';

@Entity('hrm_bank_details')
export class BankDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employeeId?: number;

  @Column()
  accountHolderName?: string;

  @Column()
  accountNumber?: string;

  @Column()
  bankName?: string;

  @Column()
  bankIdentifierCode?: string;

  @Column()
  branchLocation?: string;

  @Column()
  taxPayerId?: string;

  @ManyToOne(() => Employee, (employee) => employee.bankDetails, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;
}
