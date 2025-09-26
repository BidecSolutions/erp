import { PartialType } from '@nestjs/mapped-types';
import { CreateStockAdjustmentDto } from './create-stock_adjustment.dto';

export class UpdateStockAdjustmentDto extends PartialType(CreateStockAdjustmentDto) {}
