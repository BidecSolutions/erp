import { IsNumber, IsArray, ValidateNested, IsDecimal, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePurchaseQuotationItemDto } from './create-purchase-quotation-item.dto';
import { QuotationItem } from '../entities/purchase_quotation_item.entity';
import { SupplierQuotationDto } from './supplier-quotation.dto';

export class CreatePurchaseQuotationDto {
  @IsNumber()
  purchase_request_id: number;

  @IsNumber()
  company_id: number;

  @IsNumber()
  branch_id: number;


  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SupplierQuotationDto)
  suppliers: SupplierQuotationDto[];
}

