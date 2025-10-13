import { PartialType } from '@nestjs/mapped-types';
import { ArrayMinSize, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProductDto, CreateProductVariantDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  // 🟢 override variants for update
  @IsOptional() // not required every time
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants?: CreateProductVariantDto[];
}
