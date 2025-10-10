import { IsNumber, IsOptional } from 'class-validator';
import { PurchaseQuotation } from '../entities/purchase_quotation.entity';
import { Column } from 'typeorm';

export class CreatePurchaseQuotationItemDto {
  @IsNumber()
  product_id: number;

  @IsNumber()
  variant_id: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unit_price: number;

  @IsOptional()
  @IsNumber()
  delivery_days?: number;
  
  // PurchaseQuotation:PurchaseQuotation

  @Column()
   supplier_id: number;
}
