import { IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateChartOfAccountDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  company_id: number;

  @IsOptional()
  is_bank_account?: number;

  @IsOptional()
  is_cash_account?: number;
}
