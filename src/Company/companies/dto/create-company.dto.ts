import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreateCompanyDto {
  @IsNotEmpty()
  company_name: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional() // because controller sets this later
  @IsString()
  company_logo_path: string;

  @IsOptional()
  legal_name?: string;

  @IsNotEmpty()
  address_line1: string;

  @IsOptional()
  address_line2?: string;

  @IsOptional()
  city: string;

  @IsOptional()
  state: string;
  @IsOptional()
  country: string;
  @IsOptional()
  postal_code: string;
  @IsNotEmpty()
  phone?: string;
  @IsOptional()
  mobile?: string;

  @IsNotEmpty()
  website?: string;
  @IsOptional()
  tax_id?: string;
  @IsOptional()
  registration_no?: string;
  @IsNotEmpty()
  license_no?: string;
  @IsOptional()
  incorporation_date?: string;
  @IsOptional()
  company_type?: string;
  @IsOptional()
  currency_code?: string;
  @IsOptional()
  fiscal_year_start?: string;
  @IsOptional()
  time_zone?: string;

}
