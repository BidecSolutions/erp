import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTaxTypeDto {
  @IsNumber()
  @IsNotEmpty()
  company_id: number;

  @IsString()
  @IsNotEmpty()
  tax_code: string;   // 👈 uniqueness handled in entity + service

  @IsString()
  @IsNotEmpty()
  tax_name: string;

  @IsString()
  @IsOptional()
  tax_type?: string;

  @IsNumber()
  @IsOptional()
  tax_rate?: number;

  @IsNumber()
  @IsOptional()
  status?: number;

  @IsNumber()
  @IsNotEmpty()
  created_by: number;
}

export class UpdateTaxTypeDto extends PartialType(CreateTaxTypeDto) {}
