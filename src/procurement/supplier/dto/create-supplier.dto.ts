import { IsString, IsOptional, IsNumber, IsObject, IsNotEmpty } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  tax_id?: string;

  
  @IsNotEmpty()
  @IsString()
  email: string;

    @IsString()
   @IsNotEmpty()
    phone?: string;
    @IsString()
   @IsNotEmpty()
    address?: string;


  @IsOptional()
  @IsString()
  payment_terms?: string;

  @IsString()
   @IsNotEmpty()

    account_number?: string;
      @IsString()
   @IsNotEmpty()
    bank_name?: string;
      @IsString()
   @IsNotEmpty()
    iban?: string;

  @IsOptional()
  @IsNumber()
  rating?: number;
}
