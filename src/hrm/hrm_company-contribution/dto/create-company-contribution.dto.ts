import { IsNotEmpty, IsString, IsIn, IsNumber } from 'class-validator';

export class CreateCompanyContributionDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString()
  @IsIn(['fixed', 'percentage'], { message: 'Type must be fixed or percentage' })
  type: 'fixed' | 'percentage';

  @IsNumber()
  @IsNotEmpty({ message: 'Amount is required' })
  amount: number;
}
