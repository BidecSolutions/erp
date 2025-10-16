import {
  IsInt,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class ReturnItemDto {
  @IsInt()
  @IsNotEmpty({ message: 'Product ID is required' })
  product_id: number;

  @IsInt()
  @IsNotEmpty({ message: 'Variant ID is required' })
  variant_id: number;

  @IsInt()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}

export class CreateSalesReturnDto {
  @IsInt()
  @IsNotEmpty({ message: 'Sales Order ID is required' })
  sales_order_id: number;

  @IsArray({ message: 'Return items are required' })
  @ValidateNested({ each: true })
  @Type(() => ReturnItemDto)
  return_items: ReturnItemDto[];
}
