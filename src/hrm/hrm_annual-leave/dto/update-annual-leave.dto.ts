import { IsInt, IsOptional, IsString, Length, Min } from 'class-validator';

export class UpdateAnnualLeaveDto {
  @IsString({ message: 'Name must be a string' })
  @Length(3, 50, { message: 'Name must be between 3 and 50 characters' })
  @IsOptional()
  name?: string;

  @IsInt({ message: 'Total leave must be an integer' })
  @Min(0, { message: 'Total leave cannot be negative' })
  @IsOptional()
  total_leave?: number;
}
