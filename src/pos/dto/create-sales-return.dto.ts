import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
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
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}

export class CreateSalesReturnDto {
  @IsInt()
  @IsNotEmpty({ message: 'Sales Order ID is required' })
  sales_order_id: number;

  @IsBoolean()
  @IsOptional()
  is_full_return?: boolean = false; // default to false

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReturnItemDto)
  @IsOptional()
  return_items?: ReturnItemDto[];
}
