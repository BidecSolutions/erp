import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty({ message: 'Account Holder Name is required' })
  bankHolderName: string;

  @IsString()
  @IsNotEmpty({ message: 'Bank Name is required' })
  bankName: string;
}
