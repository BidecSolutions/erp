import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateBankDetailDto {
  
 @IsOptional()
  @Type(() => Number) // <-- converts string to number
  @IsNumber()
  id?: number;

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
