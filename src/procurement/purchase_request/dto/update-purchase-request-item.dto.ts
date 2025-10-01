import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchaseRequestDto } from './create-purchase_request.dto';
import { CreatePurchaseRequestItemDto } from './create-purchase-request-item.dto';

export class UpdatePurchaseRequestItemDto extends PartialType(CreatePurchaseRequestItemDto) {}
