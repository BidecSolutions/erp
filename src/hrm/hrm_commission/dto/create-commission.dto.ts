import { IsString, IsNotEmpty, IsNumber, IsEnum, IsDateString } from 'class-validator';

export class CreateCommissionDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsEnum(['fixed', 'percentage', 'period'], { message: 'Type must be fixed, percentage, or period' })
  type: 'fixed' | 'percentage' | 'period';

  @IsNumber({}, { message: 'Amount must be a number' })
  amount: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsEnum(['active', 'expired'], { message: 'Status must be active or expired' })
  status: 'active' | 'expired';
}
