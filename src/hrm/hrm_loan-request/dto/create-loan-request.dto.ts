import { IsNotEmpty, IsNumber, IsOptional, Min, IsString } from 'class-validator';

export class CreateLoanRequestDto {
  @IsNotEmpty({ message: 'Employee ID is required' })
  @IsNumber({}, { message: 'Employee ID must be a number' })
  emp_id: number;

  @IsNotEmpty({ message: 'Loan amount is required' })
  @IsNumber({}, { message: 'Loan amount must be a number' })
  @Min(1, { message: 'Loan amount must be at least 1' })
  amount: number;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;
}
