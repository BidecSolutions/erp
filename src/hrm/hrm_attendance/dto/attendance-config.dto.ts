import {
  IsString,
  IsInt,
  IsOptional,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class AttendanceConfigDto {

  @IsInt()
  grace_period_minutes: number;

  @IsInt()
  half_day_after_minutes: number;

  @IsInt()
  overtime_after_minutes: number;

  @IsArray()
  @IsOptional()
  weekends?: string[];
}
