import { IsEmail, isEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';
export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  company_name: string;


  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;


  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, {
    message: 'Password must contain at least one special character',
  })
  password: string;


  @IsNotEmpty({ message: "Please Enter the Company Logo" }) // because controller sets this later  dfssdsdfs
  @IsString()
  company_logo_path: string;


  @IsNotEmpty({ message: "Please Enter Atleast 1 Address" })
  address_line1: string;


  @IsNotEmpty({ message: "Please Enter the Contact No." })
  phone: string;


  @IsNotEmpty({ message: "Please Enter the License No." })
  license_no?: string;

  @IsOptional()
  legal_name?: string;

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
  mobile?: string;

  @IsOptional()
  website?: string;

  @IsOptional()
  tax_id?: string;

  @IsOptional()
  registration_no?: string;

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
