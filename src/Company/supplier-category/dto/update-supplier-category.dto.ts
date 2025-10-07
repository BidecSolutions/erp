import { IsOptional } from "class-validator";

export class UpdateSupplierCategoryDto {

  @IsOptional()
  category_code?: string;

  @IsOptional()
  category_name?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  is_active?: number;
}
