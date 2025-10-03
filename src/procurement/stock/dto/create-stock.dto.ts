import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { JoinColumn, ManyToOne } from 'typeorm';
import { Product } from 'src/procurement/product/entities/product.entity';


export class CreateStockDto {
  @IsNumber()
  @IsNotEmpty()
  company_id: number;

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
  variant_id?: number | null;

  @IsInt()
  @Min(0)
  quantity_on_hand: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  alert_qty?: number;

}

