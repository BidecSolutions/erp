import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDto } from './create-employee.dto';
import { UpdateBankDetailDto } from 'src/hrm/hrm_bank-details/dto/update-bank-details.dto';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateBankDetailDto)
  bankDetails?: UpdateBankDetailDto[];
}
