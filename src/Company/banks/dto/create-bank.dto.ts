import { IsNotEmpty } from 'class-validator';

export class CreateBankDto {
  @IsNotEmpty()
  bank_name: string;

}
