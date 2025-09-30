import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';
import { AdjustmentReason, AdjustmentType } from 'src/procurement/enums/stock-adjustments.enum';

export class CreateStockAdjustmentDto {
  @IsInt()
  @IsNotEmpty()
  product_id: number;

  @IsInt()
  @IsNotEmpty()
  warehouse_id: number;

  @IsInt()
  @IsPositive()
  quantity: number;

 @IsNotEmpty()
  @IsEnum(AdjustmentType, { message: 'Invalid status' })
  adjustment_type: AdjustmentType;

 @IsNotEmpty()
  @IsEnum(AdjustmentReason, { message: 'Invalid status' })
  reason: AdjustmentReason;


}
