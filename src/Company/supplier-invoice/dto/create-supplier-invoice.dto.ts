import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSupplierInvoiceDto {
  @IsNotEmpty()
  company_id: number;

  @IsNotEmpty()
  supplier_id: number;

  @IsOptional()
  purchase_order_id?: number;

  @IsNotEmpty()
  bill_no: string;

  @IsNotEmpty()
  supplier_bill_no: string;

  @IsNotEmpty()
  bill_date: string;

  @IsNotEmpty()
  due_date: string;

  @IsOptional()
  payment_terms?: string;

  @IsNumber()
  bill_amount: number;

  @IsNumber()
  tax_amount: number;

  @IsNumber()
  discount_amount: number;

  @IsNumber()
  total_amount: number;

  @IsOptional()
  paid_amount?: number;

  @IsOptional()
  outstanding_amount?: number;

  @IsNotEmpty()
  bill_status: string;

  @IsNotEmpty()
  approval_status: string;

  @IsNotEmpty()
  currency_code: string;

  @IsOptional()
  exchange_rate?: number;

  @IsOptional()
  notes?: string;

  @IsOptional()
  attachment_path?: string;
}
