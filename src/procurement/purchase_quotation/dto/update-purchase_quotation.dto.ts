import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchaseQuotationDto } from './create-purchase_quotation.dto';

export class UpdatePurchaseQuatiationDto extends PartialType(CreatePurchaseQuotationDto) {}
