import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchaseGrnDto } from './create-goods_receiving_note.dto';

export class UpdatePurchaseGrnDto extends PartialType(CreatePurchaseGrnDto) {}
