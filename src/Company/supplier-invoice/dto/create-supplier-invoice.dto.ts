import { IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateSupplierInvoiceDto {

  purchase_order_id:number;

  @IsNotEmpty()
  @IsDateString()
  invoice_date: string;

 
  @IsNotEmpty()
  @IsDateString()
  due_date: string;

  @IsOptional()
  @IsString()
  payment_terms?: string;

  
  @IsOptional()
  @IsString()
  payment_method?: string;

  @IsOptional()
  @IsNumber()
  tax_amount?: number;

  @IsOptional()
  @IsNumber()
  discount_amount?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  attachment_path?: string;
}
