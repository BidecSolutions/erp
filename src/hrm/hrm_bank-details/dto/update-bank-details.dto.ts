import { PartialType } from '@nestjs/mapped-types';
import { CreateBankDetailDto } from './create-bank-details.dto';
import { IsNumber } from 'class-validator';

export class UpdateBankDetailDto extends PartialType(CreateBankDetailDto) {
  @IsNumber()
  id: number;
}
