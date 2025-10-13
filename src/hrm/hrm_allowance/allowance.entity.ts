import { Company } from 'src/Company/companies/company.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert } from 'typeorm';


export enum AllowanceType {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage',
}

@Entity('hrm_allowances')
export class Allowance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: AllowanceType })
  type: AllowanceType;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @ManyToOne(() => Company, { eager: true }) // eager true -> auto load
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column()
  company_id: number;


   @Column({
          type: 'int',
          comment: '0 = inactive, 1 = active',
          default: 1
      })
      status: number;
  
        @Column({ name: 'created_by', nullable: true })
  created_by: number;

      @Column({ name: 'updated_by', nullable: true })
  updated_by: number;

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
