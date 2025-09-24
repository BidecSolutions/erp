import { IsNotEmpty, IsString, IsEnum, IsNumber, IsDateString } from 'class-validator';

export class CreateLoanDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsNotEmpty({ message: 'Loan option is required' })
  loanOption: number; // sirf LoanOption ka id bhejna hoga

  @IsEnum(['fixed', 'percentage'], { message: 'Type must be either fixed or percentage' })
  type: string;

  @IsNumber({}, { message: 'Loan amount must be a number' })
  @IsNotEmpty({ message: 'Loan amount is required' })
  loanAmount: number;

  @IsDateString({}, { message: 'Start date must be a valid date (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'Start date is required' })
  startDate: Date;

  @IsDateString({}, { message: 'End date must be a valid date (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'End date is required' })
  endDate: Date;

  @IsString({ message: 'Reason must be a string' })
  @IsNotEmpty({ message: 'Reason is required' })
  reason: string;
}
