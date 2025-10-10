import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
  ValidateNested,
  IsArray,
  IsInt,
  IsBoolean,
  ArrayMinSize,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  product_name: string;

  @IsOptional()
  @IsString()
  product_type?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  mrp?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minimum_stock_level?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maximum_stock_level?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  warranty_type?: number;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  branch_id: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  category_id: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  module_type: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  brand_id: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  uom_id: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'at least one variant required' })
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants: CreateProductVariantDto[];
}

export class CreateProductVariantDto {

  @IsNotEmpty()
  @IsString()
  variant_name: string;

  @IsOptional()
  @IsString()
  attribute_name?: string;

  @IsOptional()
  @IsString()
  attribute_value?: string;

    @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  unit_price?: number;

    @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  cost_price?: number;;
}


