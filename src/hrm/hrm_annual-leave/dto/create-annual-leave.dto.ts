import { IsInt, IsNotEmpty, IsString, Length, Min } from 'class-validator';

export class CreateAnnualLeaveDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @Length(3, 50, { message: 'Name must be between 3 and 50 characters' })
  name: string;

  @IsInt({ message: 'Total leave must be an integer' })
  @Min(1, { message: 'Total leave must be at least 1' })
  @IsNotEmpty({ message: 'Total leave is required' })
  total_leave: number;
}
