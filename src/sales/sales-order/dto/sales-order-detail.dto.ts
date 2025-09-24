 import { PartialType } from '@nestjs/mapped-types';
import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsDateString,
  IsInt,
  IsNotEmpty,
} from 'class-validator';

export class CreateSalesOrderDetailDto {
  @IsNumber()
  @Min(1, { message: 'Product ID must be a valid number' })
  product_id: number;

  @IsNumber()
  @IsNotEmpty()
  sale_order_id:number;

  @IsString()
  description?: string;

  @IsNumber()
  @Min(1, { message: 'Quantity must be greater than 0' })
  quantity: number;

  @IsNumber()
  @Min(0, { message: 'Unit price must not be negative' })
  unit_price: number;

  
  @IsNumber()
  @Min(0, { message: 'Discount % must not be negative' })
  discount_percent?: number;

  
  @IsNumber()
  @Min(0, { message: 'Discount amount must not be negative' })
  discount_amount?: number;

  
  @IsNumber()
  @Min(0, { message: 'Line total must not be negative' })
  line_total?: number;

  
  @IsNumber()
  @Min(0, { message: 'Tax rate must not be negative' })
  tax_rate?: number;

  
  @IsNumber()
  @Min(0, { message: 'Tax amount must not be negative' })
  tax_amount?: number;

  
  @IsDateString()
  required_date?: Date;

  
  @IsNumber()
  @Min(0, { message: 'Delivered quantity must not be negative' })
  delivered_quantity?: number;

  
  @IsNumber()
  @Min(0, { message: 'Pending quantity must not be negative' })
  pending_quantity?: number;

  
  @IsString()
  line_status?: string;

  
  @IsInt()
  @Min(0, { message: 'Line order must not be negative' })
  line_order?: number;

  

}

export class UpdateSalesOrderDetailDto extends PartialType (CreateSalesOrderDetailDto) {}
