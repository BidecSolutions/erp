import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchaseRequestItemDto } from './create-purchase_request_item.dto';

export class UpdatePurchaseRequestItemDto extends PartialType(CreatePurchaseRequestItemDto) {}
