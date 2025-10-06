import { IsInt, Min, IsEnum } from 'class-validator';

export class CreateProbationSettingDto {
  @IsInt()
  @Min(1, { message: 'leave_days must be at least 1' })
  leave_days: number;

  @IsInt()
  @Min(1, { message: 'probation_period must be at least 1' })
  probation_period: number;

  @IsEnum(['days', 'months'], {
    message: 'duration_type must be either days or months',
  })
  duration_type: 'days' | 'months';
}
