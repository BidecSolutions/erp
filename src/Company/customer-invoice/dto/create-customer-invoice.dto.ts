import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCustomerInvoiceDto {
  @IsNotEmpty()
  company_id: number;

  @IsNotEmpty()
  customer_id: number;

  @IsOptional()
  sales_order_id?: number;

  @IsNotEmpty()
  @IsString()
  invoice_no: string;

  @IsNotEmpty()
  invoice_date: string;

  @IsNotEmpty()
  due_date: string;

  @IsOptional()
  payment_terms?: string;

  @IsNumber()
  subtotal: number;

  @IsNumber()
  tax_amount: number;

  @IsNumber()
  discount_amount: number;

  @IsNumber()
  total_amount: number;

  @IsOptional()
  @IsNumber()
  paid_amount?: number;

  @IsOptional()
  @IsNumber()
  outstanding_amount?: number;

  @IsNotEmpty()
  invoice_status: string;

  @IsNotEmpty()
  currency_code: string;

  @IsOptional()
  exchange_rate?: number;

  @IsOptional()
  notes?: string;

  @IsOptional()
  attachment_path?: string;
}
