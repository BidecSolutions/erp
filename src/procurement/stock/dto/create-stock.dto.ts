import { IsInt, IsNotEmpty, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateStockDto {

  @IsNotEmpty()
  product_id: number;

  
  @IsNotEmpty()
  warehouse_id: number;

  @IsInt()
  @Min(0)
  quantity_on_hand: number;

  @IsInt()
  @Min(0)
  reorder_level: number;

  @IsInt()
  @Min(0)
  reorder_quantity: number;

    @IsOptional()
    @IsInt()
    company_id?: number;

    @IsOptional()
    @IsInt()
    branch_id?: number;
  
  
}
