import { IsString, IsInt, IsOptional, IsArray } from 'class-validator';

export class AttendanceConfigDto {
  @IsInt({ message: 'Grace period must be a number of minutes' })
  grace_period_minutes: number; // Allowed minutes late before marking as late

  @IsInt({ message: 'Half day limit must be a number of minutes' })
  half_day_after_minutes: number; // Minimum worked minutes to consider full day

  @IsInt({ message: 'Overtime starts after this many minutes' })
  overtime_after_minutes: number; // Minutes after which overtime starts

  @IsOptional()
  @IsArray({ message: 'Weekends must be an array of strings' })
  @IsString({ each: true, message: 'Each weekend day must be a string' })
  weekends?: string[]; // Example: ['Saturday', 'Sunday']
}
