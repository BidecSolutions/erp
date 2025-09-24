import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('hrm_allowance_options')
export class AllowanceOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}
