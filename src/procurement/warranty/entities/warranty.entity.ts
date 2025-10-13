import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Product } from 'src/procurement/product/entities/product.entity';
import { Company } from 'src/Company/companies/company.entity';

@Entity('warranties')
export class Warranty {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    warranty_type: string;

    @Column()
    duration: string;

    @Column({ name: 'status',  default: 1 })
    status: number;

     @ManyToOne(() => Company, { eager: true }) // eager true -> auto load
      @JoinColumn({ name: 'company_id' })
      company: Company;
    
      @Column()
      company_id: number;
      
    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

  @Column({ name: 'created_by', nullable: true })
  created_by: number;

      @Column({ name: 'updated_by', nullable: true })
  updated_by: number;

}
