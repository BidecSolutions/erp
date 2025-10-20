import { IsInt, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateWarehouseDto {
  @IsOptional()
  @IsInt()
  branch_id?: number;

  @IsString()
  warehouse_name: string;

  @IsOptional()
  @IsString()
  warehouse_type?: string;

  @IsOptional()
  @IsString()
  address_line1?: string;

  @IsOptional()
  @IsString()
  address_line2?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  postal_code?: string;
 
}
