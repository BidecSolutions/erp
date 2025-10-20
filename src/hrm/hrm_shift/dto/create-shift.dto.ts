import { IsNotEmpty, IsString } from 'class-validator';

export class CreateShiftDto {
  @IsNotEmpty({ message: 'Shift name is required' })
  @IsString({ message: 'Shift name must be a string' })
  name: string;
}
