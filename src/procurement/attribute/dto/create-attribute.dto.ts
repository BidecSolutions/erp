import { IsNotEmpty, IsOptional, IsString, IsInt, IsBoolean, IsNumber } from 'class-validator';

export class CreateAttributeDto {

  @IsNotEmpty()
  @IsString()
  attribute_name: string;

  @IsInt()
  branch_id: number;

}

import { PartialType } from '@nestjs/mapped-types';

export class UpdateAttributeDto extends PartialType(CreateAttributeDto) {}
