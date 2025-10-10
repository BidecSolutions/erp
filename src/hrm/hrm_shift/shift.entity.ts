import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from '../hrm_employee/employee.entity';
import { Company } from 'src/Company/companies/company.entity';

@Entity('hrm_shift')
export class Shift {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

   @Column({ type: 'time', nullable: false })
  start_time: string; // e.g. "09:00:00"

  @Column({ type: 'time', nullable: false })
  end_time: string; // e.g. "18:00:00"

   @OneToMany(() => Employee, (emp) => emp.shift)
  employees: Employee[];

  @ManyToOne(() => Company, { eager: true }) // eager true -> auto load
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column()
  company_id: number;


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
}
