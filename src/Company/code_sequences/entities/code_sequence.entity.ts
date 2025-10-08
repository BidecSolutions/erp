import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('code_sequences')
export class CodeSequence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  module_name: string; 

  @Column()
  prefix: string; 

  @Column({ default: 0 })
  last_number: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
