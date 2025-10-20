import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateCustomerCategoryDto {

  @IsOptional()
  category_code: string;

  @IsNotEmpty({ message: "Category Name is Required" })
  category_name: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsNumber()
  discount_percent?: number;

}
