import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class CreatePurchaseRequestItemDto {
  @IsInt()
  @IsNotEmpty()
  product_id: number;

  @IsInt()
  @IsOptional()
  variant_id?: number;

  @IsInt()
  @IsPositive()
  qty_requested: number;

  

}
