import { IsOptional, IsString, Length, IsInt } from 'class-validator';

export class UpdateDepartmentDto {
  @IsOptional()
  @IsString({ message: 'Department name must be a string' })
  @Length(3, 50, { message: 'Department name must be between 3 and 50 characters' })
  name?: string;
}
