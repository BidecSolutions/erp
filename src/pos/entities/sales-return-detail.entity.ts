import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeInsert,
  JoinColumn,
} from 'typeorm';
import { SalesReturn } from './sales-return.entity';
import { Product } from 'src/procurement/product/entities/product.entity';

@Entity()
export class SalesReturnDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SalesReturn, (salesReturn) => salesReturn.details, {
    onDelete: 'CASCADE', // if a sales return is deleted, its details are deleted too
  })
  @JoinColumn({ name: 'sales_return_id' })
  salesReturn: SalesReturn;

  @ManyToOne(() => Product, (product) => product.salesReturnDetails, {
    onDelete: 'SET NULL', // product deletion keeps the detail but removes link
    nullable: true,
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unit_price: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'date' })
    created_date: string;


 @Column({ type: 'date', nullable: true })
 updated_date: string;
 @BeforeInsert()
 setCreateDate() {
     const today = new Date().toISOString().split('T')[0];
     this.created_date = today;
     this.updated_date = today;
 }
}
