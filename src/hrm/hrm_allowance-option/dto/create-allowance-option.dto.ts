import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateAllowanceOptionDto {
  @IsString()
  @IsNotEmpty({ message: 'Allowance Option Name is required' })
  @Length(2, 50, { message: 'Allowance Option Name must be between 2 and 50 characters' })
  name: string;
}
