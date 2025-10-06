import { IsNotEmpty, IsOptional, IsInt, IsBoolean, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  category_name: string;

  @IsNotEmpty()
  @IsString()
  category_code: string;

  @IsOptional()
  @IsString()
  description?: string;
  
  @IsInt()
  branch_id: number;

}
