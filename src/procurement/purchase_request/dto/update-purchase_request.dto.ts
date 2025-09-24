import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchaseRequestDto } from './create-purchase_request.dto';

export class UpdatePurchaseRequestDto extends PartialType(CreatePurchaseRequestDto) {}
