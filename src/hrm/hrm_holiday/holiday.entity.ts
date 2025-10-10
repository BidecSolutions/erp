import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';

@Entity('hrm_holiday')
export class Holiday {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'text', nullable: true })
  description: string;

@Column({ type: 'int' })
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
