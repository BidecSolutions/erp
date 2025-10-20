import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class GeneratePayrollDto {
  @IsNotEmpty({ message: 'Employee ID is required' })
  @IsNumber({}, { message: 'Employee ID must be a number' })
  @Type(() => Number)
  employee_id: number;

  @IsNotEmpty({ message: 'Month is required' })
  @IsNumber({}, { message: 'Month must be a number' })
  @Min(1, { message: 'Month must be between 1 and 12' })
  @Max(12, { message: 'Month must be between 1 and 12' })
  @Type(() => Number)
  month: number;

  @IsNotEmpty({ message: 'Year is required' })
  @IsNumber({}, { message: 'Year must be a number' })
  @Type(() => Number)
  year: number;
}
