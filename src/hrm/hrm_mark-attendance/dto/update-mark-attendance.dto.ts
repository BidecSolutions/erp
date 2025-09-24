import { PartialType } from '@nestjs/mapped-types';
import { CreateAttendanceDto } from './create-mark-attendance.dto';

export class UpdateAttendanceDto extends PartialType(CreateAttendanceDto) {}
