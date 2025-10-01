import { PartialType } from '@nestjs/mapped-types';
import { CreateUnpaidLeaveDto } from './create-unpaid-leave.dto';

export class UpdateUnpaidLeaveDto extends PartialType(CreateUnpaidLeaveDto) {}
