import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from '../hrm_employee/employee.entity';

@Entity('hrm_documents')
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string; // e.g. 'cv', 'photo', 'cnic'

  @Column()
  filePath: string; // uploaded file ka path

  @ManyToOne(() => Employee, (employee) => employee.documents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column()
  employeeId: number;
}
