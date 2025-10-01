import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity('banks')
export class Bank {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  bank_name: string;

  @Column({ type: 'tinyint', default: 1,comment:'1 = active, 0 = inactive' })
  status: number; 

  @Column({ nullable: true })
  created_by: number;

  @Column({ nullable: true })
  updated_by: number;

  @Column({ type: 'date', nullable: true  })
  created_date: string;

  @Column({ type: 'date', nullable: true })
  updated_date: string;

  @BeforeInsert()
  setCreatedDate() {
    const today = new Date().toISOString().slice(0, 10);
    this.created_date = today;
    this.updated_date = today;
  }

}
