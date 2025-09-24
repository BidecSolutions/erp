import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('pro_suppliers')
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  tax_id: string;

  @Column({ type: 'varchar', unique: true })
    email: string;
  @Column()
    phone: string;
      @Column()
    address?: string;

  @Column({ nullable: true })
  payment_terms: string; // e.g. "Net 30"

  @Column()
    account_number: string;
      @Column()
    bank_name: string;
      @Column()
    iban?: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  rating: number;

  @Column({ default: '0' })
  status: number; // ACTIVE, INACTIVE
}
