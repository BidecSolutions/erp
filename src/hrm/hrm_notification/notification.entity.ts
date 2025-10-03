import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { NotificationType } from '../hrm_notification-type/notification-type.entity';
import { Employee } from '../hrm_employee/employee.entity';

// ✅ Enum inside same file (no separate file)
export enum NotificationReadStatus {
  UNREAD = 0,
  READ = 1,
}

@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'emp_id' })
  employee: Employee;

 @Column()
  emp_id: number;

  
  @ManyToOne(() => NotificationType)
  @JoinColumn({ name: 'notification_type_id' })
  notificationType: NotificationType;


  @Column({ type: 'varchar', length: 255 })
  message: string; 


  @Column({
    type: 'int',
    default: NotificationReadStatus.UNREAD,
    comment: '0 = unread, 1 = read',
  })
  read_status: NotificationReadStatus;

  
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
