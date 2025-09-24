import { IsNotEmpty, IsOptional } from 'class-validator';
export class CreateCompanyDto {
  @IsNotEmpty()
  company_name: string;
  @IsOptional()
  legal_name?: string;
  @IsOptional()
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
  @IsOptional()
  phone?: string;
  @IsOptional()
  mobile?: string;
  @IsOptional()
  email: string;
  @IsOptional()
  website?: string;
  @IsOptional()
  tax_id?: string;
  @IsOptional()
  registration_no?: string;
  @IsOptional()
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
