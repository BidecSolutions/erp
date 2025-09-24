import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsNumber, IsString, IsDecimal, ValidateNested } from 'class-validator';
import { CreateProductVariantDto } from './create-variant.dto';

export class CreateProductDto {
  @IsNotEmpty()
  sku: string;

  @IsNotEmpty()
  product_code: string;

  @IsNotEmpty()
  product_name: string;

  @IsOptional()
  product_type?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  specifications?: string;

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
  is_serialized?: number;

  @IsOptional()
  is_batch_tracked?: number;

  @IsOptional()
  allow_negative_stock?: number;

  @IsOptional()
  warranty_period_days?: number;

  @IsOptional()
  warranty_type?: string;

  @IsOptional()
  hsn_code?: string;

  @IsOptional()
  tax_rate?: number;

  @IsOptional()
  product_status?: string;

  @IsOptional()
  barcode?: string;

  @IsOptional()
  product_image_path?: string;

  @IsOptional()
  created_by?: number;

  @IsOptional()
  updated_by?: number;

  // Relations
  // @IsOptional()
  // company_id?: number;

  // @IsOptional()
  // branch_id?: number;

  @IsOptional()
  category_id?: number;

  @IsOptional()
  brand_id?: number;

  @IsOptional()
  uom_id?: number;


  // variant data
  @IsOptional()               
  @ValidateNested({ each: true })     
  @Type(() =>  CreateProductVariantDto)      
  variants?: CreateProductVariantDto[]; 

    // @IsOptional()
    // @IsNumber()
    // product_id?: number;
  
    // @IsString()
    // @IsOptional()
    // variant_name: string;
  
    // @IsOptional()
    // @IsString()
    // variant_code?: string;
  
    // @IsOptional()
    // @IsString()
    // attribute_name?: string;
  
    // @IsOptional()
    // @IsString()
    // attribute_value?: string;
  
    // @IsOptional()
    // price_difference?: number;
  
    // @IsOptional()
    // cost_difference?: number;


}
