import { IsNotEmpty, IsOptional, IsString, IsInt, IsBoolean, IsNumber } from 'class-validator';

export class CreateBrandDto {

  @IsNotEmpty()
  @IsString()
  brand_name: string;

  @IsOptional()
  @IsString()
  description?: string;
  
  @IsInt()
  branch_id: number;

}
