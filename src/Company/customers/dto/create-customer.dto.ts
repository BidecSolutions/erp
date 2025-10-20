import { IsNotEmpty, IsOptional, IsEmail, isNumber, isInt, IsInt } from 'class-validator';

export class CreateCustomerDto {

  @IsInt({ message: 'Customer category must be a valid integer ID' })
  @IsNotEmpty({ message: 'Customer category is required' })
  category_customer: number; // Pass ID of category

  @IsNotEmpty({ message: "Customer Name is Required" })
  customer_name: string;

  @IsNotEmpty({ message: "Mobile No can not Empty" })
  phone: string;

  @IsNotEmpty({ message: "Atleast one Address is required" })
  address_line1: string;

  @IsNotEmpty({ message: "Customer Email Address Is Required" })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;


  @IsOptional()
  credit_limit?: number;

  @IsOptional()
  credit_days?: number;

  @IsOptional()
  mobile?: string;

  @IsOptional()
  customer_type?: string;

  @IsOptional()
  contact_person?: string;

  @IsOptional()
  designation?: string;

  @IsOptional()
  website?: string;

  @IsOptional()
  address_line2?: string;

  @IsOptional()
  city?: string;

  @IsOptional()
  state?: string;

  @IsOptional()
  customer_code: string;

  @IsOptional()
  country?: string;

  @IsOptional()
  postal_code?: string;

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
