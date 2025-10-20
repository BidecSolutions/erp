import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class CreatePayrollDto {
  @IsInt({ message: 'Month must be an integer.' })
  @Min(1, { message: 'Month must be between 1 and 12.' })
  @Max(12, { message: 'Month must be between 1 and 12.' })
  month: number;

  @IsInt({ message: 'Year must be an integer.' })
  @Min(2000, { message: 'Year must be greater than 2000.' })
  @IsNotEmpty({ message: 'Year is required.' })
  year: number;
}
