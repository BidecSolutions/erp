import { IsNotEmpty } from 'class-validator';

export class CreateDeductionOptionDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
}
