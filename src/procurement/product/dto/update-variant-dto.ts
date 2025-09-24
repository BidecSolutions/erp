import { PartialType } from '@nestjs/mapped-types';
import { CreateProductVariantDto } from './create-variant.dto';

export class UpdateProductDto extends PartialType(CreateProductVariantDto) {}
