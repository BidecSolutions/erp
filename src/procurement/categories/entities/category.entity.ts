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

  @Column({ name: 'company_id', nullable: false })
    company_id:number;
    // @ManyToOne(() => Branch)
    // @JoinColumn({name : 'branch_id'})
    // comapany: Comapany

   @Column({ name: 'branch_id', nullable: false })
    branch_id:number;
    // @ManyToOne(() => Branch)
    // @JoinColumn({name : 'branch_id'})
    // branch: Branch

  @Column({ name: 'category_code', length: 50 ,  unique: true  })
  category_code: string;

  @Column({ name: 'category_name', length: 255 })
  category_name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'status', type: 'tinyint', default: 1 })
  status: number;

//   @Column({ name: 'display_order', nullable: true })
//   display_order: number;

  @Column({ name: 'created_by', nullable: true })
  created_by: number;

  @CreateDateColumn({ name: 'created_date', type: 'timestamp' })
  created_date: Date;
}
