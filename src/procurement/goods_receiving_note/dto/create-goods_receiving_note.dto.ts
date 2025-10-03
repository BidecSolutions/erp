import { IsNotEmpty, IsNumber, IsArray, ValidateNested, IsString, IsInt, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { grnStatus } from 'src/procurement/enums/grn-enum';

export class CreatePurchaseGrnDto {
  @IsNumber()
  po_id: number;

  @IsNotEmpty()
  grn_date: Date;


  @IsString()
  remarks?: string;


  @IsNumber()
  warehouse_id: number

  @IsInt()
  company_id: number

  @IsInt()
  branch_id: number

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseGrnItemDto)
  items: CreatePurchaseGrnItemDto[];
}


export class CreatePurchaseGrnItemDto {
  @IsNumber()
  product_id: number;

  @IsNumber()
  variant_id: number;

  @IsNumber()
  received_qty: number;

  @IsNumber()
  unit_price: number;

  @IsString()
  remarks?: string;

  @IsEnum(grnStatus)
  grn_status: grnStatus;

  @IsNotEmpty()
  @IsNumber()
  accepted_qty: number;

  @IsOptional()
  @IsNumber()
  rejected_qty: number;



}

