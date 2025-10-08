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
  product_id: number;

  @IsNumber()
  variant_id: number;

  @IsNumber()
  @Min(1, { message: 'Quantity must be greater than 0' })
  quantity: number;

  // @IsNumber()
  // @IsOptional()
  // @Min(0, { message: 'Discount amount must not be negative' })
  // discount_amount?: number;

  // @IsNumber()
  // @IsOptional()
  // @Min(0, { message: 'Tax amount must not be negative' })
  // tax_amount?: number;

  // @IsDateString()
  // @IsOptional()
  // required_date?: Date;

  // @IsNumber()
  // @IsOptional()
  // @Min(0, { message: 'Delivered quantity must not be negative' })
  // delivered_quantity?: number;

  // @IsNumber()
  // @IsOptional()
  // @Min(0, { message: 'Pending quantity must not be negative' })
  // pending_quantity?: number;

  // @IsString()
  // @IsOptional()
  // line_status?: string;

  // @IsInt()
  // @IsOptional()
  // @Min(0, { message: 'Line order must not be negative' })
  // line_order?: number;

}
export class UpdateSalesOrderDetailDto extends PartialType(
  CreateSalesOrderDetailDto,
) {

  @IsOptional()
  @IsInt()
  id: number;
}
