import { IsInt, Min, IsEnum } from 'class-validator';

export class CreateProbationSettingDto {
  @IsInt({ message: 'Leave days must be an integer' })
  @Min(1, { message: 'Leave days must be at least 1' })
  leave_days: number;

  @IsInt({ message: 'Probation period must be an integer' })
  @Min(1, { message: 'Probation period must be at least 1' })
  probation_period: number;

  @IsEnum(['days', 'months'], {
    message: 'Duration type must be either "days" or "months"',
  })
  duration_type: 'days' | 'months';
}
