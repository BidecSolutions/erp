import { Branch } from 'src/Company/branch/branch.entity';
import { Company } from 'src/Company/companies/company.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity('product_categories')
export class Category {
  @PrimaryGeneratedColumn({ name: 'category_id' })
  id: number;

    @ManyToOne(() => Company, { eager: true }) // eager true -> auto load
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column()
  company_id: number;
  
   @Column({ name: 'branch_id', nullable: false })
    branch_id:number;
    @ManyToOne(() => Branch)
    @JoinColumn({name : 'branch_id'})
    branch: Branch

  @Column({ name: 'category_code', length: 50 ,  unique: true  })
  category_code: string;

  @Column({ name: 'category_name', length: 255 })
  category_name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'status', type: 'tinyint', default: 1 })
  status: number;

  @Column({ name: 'created_by', nullable: true })
  created_by: number;

  @CreateDateColumn({ name: 'created_date', type: 'timestamp' })
  created_date: Date;
}
