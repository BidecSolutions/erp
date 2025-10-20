import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateModuleTypeDto {

  @IsString()
  @IsNotEmpty()
  module_type: string;

  @IsOptional()
  @IsString()
  description?: string;

  
}
