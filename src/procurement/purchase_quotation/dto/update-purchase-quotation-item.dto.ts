import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchaseQuotationItemDto } from './create-purchase-quotation-item.dto';

export class UpdatePurchaseQuatiationDto extends PartialType(CreatePurchaseQuotationItemDto){}
