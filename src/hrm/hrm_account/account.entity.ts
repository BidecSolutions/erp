import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('hrm_accounts')
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bankHolderName: string;

  @Column()
  bankName: string;
}
