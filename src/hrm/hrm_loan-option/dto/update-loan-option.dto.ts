import { PartialType } from '@nestjs/mapped-types';
import { CreateLoanOptionDto } from './create-loan-option.dto';

export class UpdateLoanOptionDto extends PartialType(CreateLoanOptionDto) {}
