import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsNumber, IsString, IsDecimal, ValidateNested, IsArray, IsInt } from 'class-validator';

export class CreateProductDto {

  @IsNotEmpty()
  product_name: string;

  @IsOptional()
  product_type?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  unit_price?: number;

  @IsOptional()
  cost_price?: number;

  @IsOptional()
  mrp?: number;

  @IsOptional()
  minimum_stock_level?: number;

  @IsOptional()
  maximum_stock_level?: number;

  @IsOptional()
  reorder_level?: number;

  @IsOptional()
  reorder_quantity?: number;

  @IsOptional()
  warranty_type?: number;

  @IsNotEmpty()
  barcode?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsNotEmpty()
  company_id?: number;

  @IsNotEmpty()
  branch_id?: number;

  @IsNotEmpty()
  category_id?: number;

  @IsNotEmpty()
  brand_id?: number;

  @IsNotEmpty()
  uom_id?: number;

  @IsNotEmpty()
  has_variant?: boolean;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants?: CreateProductVariantDto[];
}

export class CreateProductVariantDto {
  @IsNotEmpty()
  @IsInt()
  product_id?: number;

  @IsString()
  @IsNotEmpty()
  variant_name: string;

  @IsOptional()
  @IsString()
  attribute_name?: string;

  @IsOptional()
  @IsString()
  attribute_value?: string;

}
