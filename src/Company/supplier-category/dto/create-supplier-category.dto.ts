import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateSupplierCategoryDto {
  @IsNotEmpty()
  company_id: number;

  @IsNotEmpty()
  category_code: string;

  @IsNotEmpty()
  category_name: string;

  @IsOptional()
  description?: string;
  
}
