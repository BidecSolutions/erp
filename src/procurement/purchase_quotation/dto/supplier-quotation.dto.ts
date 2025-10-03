import { IsNumber, IsDecimal, IsArray, ValidateNested, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePurchaseQuotationItemDto } from './create-purchase-quotation-item.dto';

export class SupplierQuotationDto {
  @IsNumber()
  supplier_id: number;



  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseQuotationItemDto)
  items: CreatePurchaseQuotationItemDto[];
}
