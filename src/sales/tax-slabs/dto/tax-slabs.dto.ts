import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class CreateTaxSlabDto {
    @IsNumber()
    @IsNotEmpty()
    tax_type_id: number;

    @IsNumber()
    @IsOptional()
    @IsPositive()
    from_amount?: number;

    @IsNumber()
    @IsOptional()
    @IsPositive()
    to_amount?: number;

    @IsNumber()
    @IsOptional()
    tax_rate?: number;

    @IsNumber()
    @IsOptional()
    fixed_amount?: number;

    @IsNumber()
    @IsOptional()
    status?: number;
}

export class UpdateTaxSlabDto extends PartialType(CreateTaxSlabDto) { }
