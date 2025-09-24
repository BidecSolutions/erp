import { IsOptional, IsString, Length, IsInt } from 'class-validator';

export class UpdateDesignationDto {
  @IsOptional()
  @IsString({ message: 'Designation name must be a string' })
  @Length(3, 50, { message: 'Designation name must be between 3 and 50 characters' })
  name?: string;

  @IsOptional()
  @IsInt({ message: 'Department ID must be an integer' })
  departmentId?: number;
}
