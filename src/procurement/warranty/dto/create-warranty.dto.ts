import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateWarrantyDto {

  @IsString()
  @IsNotEmpty()
  warranty_type: string;

  @IsNumber()
  @IsNotEmpty()
  duration: string;




}
