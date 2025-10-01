import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert } from 'typeorm';
import { Employee } from '../hrm_employee/employee.entity';

@Entity('hrm_annual_leave')
export class AnnualLeave {
  @PrimaryGeneratedColumn()
  id: number;

    @Column()
  name: string;

  @Column()
  total_leave: number;
 
      @Column({
             type: 'int',
            comment: '0 = inactive, 1 = active',
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

  @OneToMany(() => Employee, (emp) => emp.annualLeave)
  employees: Employee[];
}
