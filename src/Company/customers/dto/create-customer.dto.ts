import { IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  company_id: number;

  @IsNotEmpty()
  category_customer: number; // Pass ID of category

  @IsNotEmpty()
  customer_code: string;

  @IsNotEmpty()
  customer_name: string;

  @IsOptional()
  customer_type?: string;

  @IsOptional()
  contact_person?: string;

  @IsOptional()
  designation?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  mobile?: string;

  @IsOptional()
  website?: string;

  @IsOptional()
  address_line1?: string;

  @IsOptional()
  address_line2?: string;

  @IsOptional()
  city?: string;

  @IsOptional()
  state?: string;

  @IsOptional()
  country?: string;

  @IsOptional()
  postal_code?: string;

  @IsOptional()
  credit_limit?: number;

  @IsOptional()
  credit_days?: number;

  @IsOptional()
  payment_terms?: string;

  @IsOptional()
  tax_id?: string;

  @IsOptional()
  gst_no?: string;

  @IsOptional()
  pan_no?: string;

  @IsOptional()
  opening_balance?: number;

  @IsOptional()
  balance_type?: string;

  @IsOptional()
  customer_status?: string;

  @IsOptional()
  registration_date?: string;

  @IsOptional()
  notes?: string;

  @IsOptional()
  assigned_sales_person?: string;

  @IsOptional()
  is_active?: number;

}
