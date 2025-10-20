import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateSupplierCategoryDto {

  @IsNotEmpty({ message: "Supplier Category Is Required" })
  category_name: string;

  @IsOptional()
  description?: string;

}
