import { IsNotEmpty, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateBranchDto {


  @IsNotEmpty({ message: "Branch name is required" })
  branch_name: string;

  @IsOptional()
  branch_type?: string;

  @IsNotEmpty({ message: "Please Enter the one address at least" })
  address_line1: string;

  @IsOptional()
  address_line2?: string;

  @IsNotEmpty({ message: "Please Enter Branch City" })
  city: string;

  @IsOptional()
  state: string;

  @IsOptional()
  country: string;

  @IsOptional()
  postal_code?: string;

  @IsNotEmpty({ message: "Please Enter Contact No." })
  phone?: string;

  @IsOptional()
  mobile?: string;

  @IsOptional()
  email?: string;

  @IsNotEmpty({ message: "Please Enter Contact Person Name" })
  manager_name?: string;

  @IsNotEmpty({ message: "Please Enter Contact Person Email" })
  manager_email?: string;

  @IsNotEmpty({ message: "Please Enter Contact Person Phone No." })
  manager_phone?: string;

  @IsNotEmpty({ message: "Opening balance is required" })
  opening_balance?: number;

  @IsNotEmpty({ message: "Please Enter the Bank Account" })
  bank_account_no?: string;

  @IsNotEmpty({ message: "Please Enter the Bank Name" })
  bank_name?: string;

  @IsOptional()
  ifsc_code?: string;

  @IsOptional()
  is_head_office?: boolean;

  @IsOptional()
  allow_negative_stock?: boolean;

}
