import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert } from 'typeorm';
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

  
     @Column({
              type: 'int',
              comment: '0 = inactive 1 = active',
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
