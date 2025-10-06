import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsNumber, IsString, IsDecimal, ValidateNested, IsArray } from 'class-validator';
import { CreateProductVariantDto } from './create-variant.dto';

export class CreateProductDto {
  @IsNotEmpty()
  sku: string;

  @IsNotEmpty()
  product_name: string;

  @IsOptional()
  product_type?: string;

  @IsOptional()
  description?: string;

  @IsNotEmpty()
  unit_price?: number;

  @IsNotEmpty()
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

  @IsOptional()
  product_status?: string;

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

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants?: CreateProductVariantDto[];


}
