import { IsString, Length, IsNotEmpty } from 'class-validator';

export class CreateDepartmentDto {
  @IsString({ message: 'Department name must be a string' })
  @IsNotEmpty({ message: 'Department name is required' })
  @Length(3, 50, { message: 'Department name must be between 3 and 50 characters' })
  name: string;
}
