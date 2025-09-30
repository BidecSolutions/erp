import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert } from 'typeorm';
import { Supplier } from './supplier.entity';


@Entity('supplier_accounts')
export class SupplierAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.accounts, { onDelete: 'CASCADE' })
  supplier: Supplier;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  amount: number;

  @BeforeInsert()
  setDefaultAmount() {
    if (this.amount === undefined || this.amount === null) {
      this.amount = 0;
    }
  }
}
