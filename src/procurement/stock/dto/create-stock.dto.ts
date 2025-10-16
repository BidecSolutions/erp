import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStockDto {

  @IsNumber()
  @IsNotEmpty()
  branch_id: number;

  @IsNumber()
  @IsNotEmpty()
  warehouse_id: number;

  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];
}

export class ProductDto {
  @IsNotEmpty()
  @IsNumber()
  product_id: number;

  @IsOptional()
  @IsNumber()
  variant_id: number;

  @IsInt()
  @Min(0)
  quantity_on_hand: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  alert_qty?: number;

}


import { PartialType } from '@nestjs/mapped-types';
export class UpdateStockDto extends PartialType(CreateStockDto) { }
