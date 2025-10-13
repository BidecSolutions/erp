import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateSupplierCategoryDto {

  @IsNotEmpty()
  category_name: string;

  @IsOptional()
  description?: string;
  
}
