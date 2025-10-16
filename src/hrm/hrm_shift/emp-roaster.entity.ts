import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { Employee } from '../hrm_employee/employee.entity';
import { Shift } from '../hrm_shift/shift.entity';

@Entity('hrm_emp_roaster')
export class EmpRoaster {
  @PrimaryGeneratedColumn()
  id: number;

  // Example: ["Monday", "Wednesday", "Friday"]

  @Column("simple-array") // stores ["Monday","Wednesday"]
  days: string[];
  
  @ManyToOne(() => Shift, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shift_id' })
  shift: Shift;

  @Column()
  shift_id: number;

  // ⏰ Now these are part of EmpRoaster (moved from Shift)
  @Column({ type: 'time', nullable: false })
  start_time: string;

  @Column({ type: 'time', nullable: false })
  end_time: string;

  @ManyToOne(() => Employee, (employee) => employee.roasters, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;   
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
