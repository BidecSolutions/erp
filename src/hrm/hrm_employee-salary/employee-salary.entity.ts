import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert } from "typeorm";
import { Paysliptype } from "src/hrm/hrm_paysliptype/paysliptype.entity";

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

   @Column({
            type: 'int',
            comment: '1 = active, 2 = inactive',
            default: 1
        })
        status: number;
    
        @Column({ type: 'date' })
        created_at: string;
    
        @Column({ type: 'date' })
        updated_at: string;
    
        @BeforeInsert()
        setDefaults() {
            const now = new Date();
            this.created_at = now.toISOString().split('T')[0];
            this.updated_at = now.toISOString().split('T')[0];
        }

}
