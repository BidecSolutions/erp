import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateCustomerPaymentDto {
  @IsNotEmpty()
  company_id: number;
  @IsNotEmpty()
  customer_id: number;
  @IsNotEmpty()
  receipt_no: string;
  @IsNotEmpty()
  receipt_date: string;
  @IsNotEmpty()
  payment_method: string;
  @IsNotEmpty()
  deposit_account_id: number;
  @IsNotEmpty()
  receipt_amount: number;
  @IsOptional()
  currency_code: string;
  @IsNotEmpty()
  exchange_rate: number;
  @IsOptional()
  reference_no?: string;
  @IsOptional()
  notes?: string;
  @IsOptional()
  attachment_path?: string;
  
}
