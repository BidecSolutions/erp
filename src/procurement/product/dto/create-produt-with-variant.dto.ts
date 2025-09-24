// dto/create-product-with-variants.dto.ts
import { CreateProductDto } from './create-product.dto';
import { CreateProductVariantDto } from './create-variant.dto';


export class CreateProductWithVariantsDto {
  product: CreateProductDto;
  variants: CreateProductVariantDto[];
}
