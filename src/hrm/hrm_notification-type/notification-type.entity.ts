import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';

@Entity('hrm_notification_type')
export class NotificationType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string; 

    
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
