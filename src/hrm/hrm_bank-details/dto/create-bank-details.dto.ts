import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBankDetailDto {
  
  @IsOptional()
  @IsString()
  accountHolderName?: string;

  
  @IsOptional()
  @IsString()
  accountNumber?: string;

  
  @IsOptional()
  @IsString()
  bankName?: string;

  @IsOptional()
  @IsString()
  bankIdentifierCode?: string;

  @IsOptional()
  @IsString()
  branchLocation?: string;

  @IsOptional()
  @IsString()
  taxPayerId?: string;
}
