import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateCustomerCategoryDto {
  @IsNotEmpty()
  company_id: number;

  @IsNotEmpty()
  category_code: string;

  @IsNotEmpty()
  category_name: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsNumber()
  discount_percent?: number;

  @IsOptional()
  created_by: string;
}
