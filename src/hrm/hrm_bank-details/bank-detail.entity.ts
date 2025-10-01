import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from '../hrm_employee/employee.entity';

@Entity('hrm_bank_details')
export class BankDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employeeId?: number;

  @Column({nullable: true})
  accountHolderName?: string;

  @Column({nullable: true})
  accountNumber?: string;

  @Column({nullable: true})
  bankName?: string;

  @Column({nullable: true})
  bankIdentifierCode?: string;

  @Column({nullable: true})
  branchLocation?: string;

  @Column({nullable: true})
  taxPayerId?: string;

  @ManyToOne(() => Employee, (employee) => employee.bankDetails, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;
}
