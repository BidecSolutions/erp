import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateUnitOfMeasureDto {
  @IsNotEmpty()
  @IsString()
  uom_name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  branch_id?: number;

}

