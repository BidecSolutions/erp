import { IsNotEmpty, IsNumber, IsOptional,IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class HoldOrderItemDto {
  @IsNotEmpty()
  @IsNumber()
  product_id: number;

  @IsNotEmpty()
  @IsNumber()
  variant_id?: number; 

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsNumber()
  unit_price?: number; // nullable

  @IsOptional()
  @IsNumber()
  subtotal?: number; // nullable
}

export class CreateHoldOrderDto {
  @IsOptional()
  company_id?: number;

  @IsOptional()
  customer_id?: number;

  @IsOptional()
  sale_person_id?: number;

  @IsNotEmpty()
  @IsNumber()
  branch_id: number;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsNumber()
  paid_amount?: number;

  @IsOptional()
  payment_method?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HoldOrderItemDto)
  order_details: HoldOrderItemDto[];
}

