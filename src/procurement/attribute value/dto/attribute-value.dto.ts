import { IsNotEmpty, IsOptional, IsString, IsInt, IsBoolean, IsNumber } from 'class-validator';

export class AttributeValueDto {

    @IsNotEmpty()
    @IsInt()
    attribute_id: number;

    @IsNotEmpty()
    @IsString()
    value: string;

    @IsNotEmpty()
    @IsInt()
    branch_id: number;

}

import { PartialType } from '@nestjs/mapped-types';

export class UpdateAttributeValueDto extends PartialType(AttributeValueDto) { }
