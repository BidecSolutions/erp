import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class PosOrderItemDto {
  @IsNotEmpty()
  @IsNumber()
  product_id: number;

  @IsOptional()
  @IsNumber()
  variant_id?: number; // required only if product has variants

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}


export class CreatePosDto {
  @IsOptional()
  company_id?: number;

  @IsOptional()
  customer_id?: number;

  @IsOptional()
  sale_person_id: number;

  @IsNotEmpty()
  branch_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PosOrderItemDto)
  order_details: PosOrderItemDto[];
}
