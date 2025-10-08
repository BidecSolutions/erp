import { IsNotEmpty, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateBranchDto {
  @IsNotEmpty()
  companyId: number;
  
  @IsNotEmpty()
  branch_name: string;

  @IsOptional()
  branch_type?: string;

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
  postal_code?: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  mobile?: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  manager_name?: string;

  @IsOptional()
  manager_email?: string;

  @IsOptional()
  manager_phone?: string;

  @IsOptional()
  opening_balance?: number;

  @IsOptional()
  bank_account_no?: string;

  @IsOptional()
  bank_name?: string;

  @IsOptional()
  ifsc_code?: string;

  @IsOptional()
  is_head_office?: boolean;

  @IsOptional()
  allow_negative_stock?: boolean;

}
