import { IsString, Length, IsInt, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateDepartmentDto {
  @IsString({ message: 'Department name must be a string' })
  @Length(2, 50, { message: 'Department name must be between 3 and 50 characters' })
  name: string;



}
