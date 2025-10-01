import { IsInt, IsNotEmpty, IsString, Length, Min } from 'class-validator';

export class CreateAnnualLeaveDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @Length(3, 50)
  name: string;

  @IsInt()
 @Min(1, { message: 'Total leave must be at least 1' })
  @IsNotEmpty()
  total_leave: number;
}
