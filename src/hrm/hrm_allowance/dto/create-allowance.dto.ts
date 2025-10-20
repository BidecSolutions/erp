import { IsString, IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { AllowanceType } from '../allowance.entity';

export class CreateAllowanceDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsEnum(AllowanceType, { message: 'Type must be either fixed or percentage' })
  @IsNotEmpty({ message: 'Type is required' })
  type: AllowanceType;

  @IsNumber({}, { message: 'Amount must be a number' })
  @IsNotEmpty({ message: 'Amount is required' })
  amount: number;
}
