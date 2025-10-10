import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
// import { InvoiceStatus } from '../../../sales/enums/sales-enums';
// import { PaymentMethod } from '../../../sales/enums/payment-method.enum';

export class CreateCustomerInvoiceDto {

  @IsNotEmpty()
  company_id: number;x

  @IsNotEmpty()
  branch_id: number;

  @IsNotEmpty()
  sales_order_id?: number;  


  @IsNotEmpty()
  @IsString()
  invoice_date: string;

  @IsNotEmpty()
  @IsString()
  due_date: string;

  @IsOptional()
  @IsString()
  payment_terms?: string;

  // @IsNumber()
  // @Min(0)
  // subtotal: number;

  @IsNumber()
  @Min(0)
  tax_amount: number;

  @IsNumber()
  @Min(0)
  discount_amount: number;

  // @IsNumber()
  // @Min(0)
  // total_amount: number;

  // @IsOptional()
  // @IsNumber()
  // @Min(0)
  // paid_amount?: number;

  // @IsEnum(PaymentMethod)
  // @IsNotEmpty()
  // payment_method: PaymentMethod;  

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  attachment_path?: string;
}
