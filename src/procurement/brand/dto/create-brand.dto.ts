import { IsNotEmpty, IsOptional, IsString, IsInt, IsBoolean, IsNumber } from 'class-validator';

export class CreateBrandDto {

  @IsNotEmpty()
  @IsString()
  brand_name: string;

  @IsNotEmpty()
  @IsString()
  brand_code: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  company_id?: number;
  
  @IsInt()
  branch_id: number;

}
