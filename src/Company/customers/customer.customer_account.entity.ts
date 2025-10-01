import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert } from 'typeorm';
import { Customer } from '../customers/customer.entity';

@Entity('customer_accounts')
export class CustomerAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.accounts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  amount: number;

  @BeforeInsert()
  setDefaultAmount() {
    if (this.amount === undefined || this.amount === null) {
      this.amount = 0;
    }
  }
}
