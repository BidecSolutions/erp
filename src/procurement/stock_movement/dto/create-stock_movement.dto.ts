import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { MovementType } from 'src/procurement/enums/stock-movement.enum';


export class CreateStockMovementDto {
  @IsNumber()
  product_id: number;

  @IsNumber()
  from_warehouse_id: number;

  @IsNumber()
  to_warehouse_id: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsString()
  @IsOptional()
  reference_type?: string;   // e.g. PO, SALE, RETURN

  @IsEnum(MovementType)
  movement_type: MovementType;

  @IsString()
  @IsOptional()
  reference_number?: string;

  @IsNumber()
  company_id: number;

  @IsNumber()
  branch_id: number;

//   @IsNumber()
//   quantity_on_hand: number; 


}
