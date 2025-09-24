import { PartialType } from '@nestjs/mapped-types';
import { CreateAllowanceOptionDto } from './create-allowance-option.dto';

export class UpdateAllowanceOptionDto extends PartialType(CreateAllowanceOptionDto) {}
