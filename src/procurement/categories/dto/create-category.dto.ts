import { IsNotEmpty, IsOptional, IsInt, IsBoolean, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  category_name: string;

  @IsOptional()
  @IsString()
  description?: string;
  
  @IsInt()
  branch_id: number;

}

import { PartialType } from '@nestjs/mapped-types';
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

