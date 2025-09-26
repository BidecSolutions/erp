import { IsString, IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { AllowanceType } from '../allowance.entity';

export class CreateAllowanceDto {

  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsEnum(AllowanceType, { message: 'Type must be either fixed or percentage' })
  type: AllowanceType;

  @IsNumber({}, { message: 'Amount must be a number' })
  amount: number;

   @IsNumber()
  @IsNotEmpty()
  company_id: number; // yahan add karo
}
