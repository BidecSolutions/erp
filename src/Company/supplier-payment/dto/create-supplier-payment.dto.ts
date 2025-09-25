import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSupplierPaymentDto {
  @IsNotEmpty()
  company_id: number;

  @IsNotEmpty()
  supplier_id: number;

  @IsNotEmpty()
  @IsString()
  payment_no: string;

  @IsNotEmpty()
  payment_date: string;

  @IsNotEmpty()
  @IsString()
  payment_method: string;

  @IsNotEmpty()
  payment_account_id: number;

  @IsNotEmpty()
  payment_amount: number;

  @IsNotEmpty()
  currency_code: string;

  @IsOptional()
  exchange_rate?: number;

  @IsOptional()
  @IsString()
  reference_no?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsNotEmpty()
  payment_status: string;

  @IsOptional()
  @IsString()
  attachment_path?: string;

}
