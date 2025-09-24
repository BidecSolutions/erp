import { IsInt, IsOptional, IsString, IsDecimal, IsBoolean } from 'class-validator';

export class CreateProductVariantDto {
  @IsOptional()
  @IsInt()
  product_id?: number;

  @IsString()
  variant_name: string;

  @IsOptional()
  @IsString()
  variant_code?: string;

  @IsOptional()
  @IsString()
  attribute_name?: string;

  @IsOptional()
  @IsString()
  attribute_value?: string;

  @IsOptional()
  price_difference?: number;

  @IsOptional()
  cost_difference?: number;

}
