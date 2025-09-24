import { IsNotEmpty, IsOptional, IsInt, IsBoolean, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  category_Code: string;

  @IsNotEmpty()
  @IsString()
  category_name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  company_id?: number;

  @IsOptional()
  @IsInt()
  branch_id: number;

//   @IsOptional()
//   @IsInt()
//   parent_category_id?: number;

  // @IsOptional()
  // @IsInt()
  // display_order?: number;
}
