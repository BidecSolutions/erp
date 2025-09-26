import { IsInt, IsNotEmpty, IsString, Length, Min } from 'class-validator';

export class CreateAnnualLeaveDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @Length(3, 50)
  name: string;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  total_leave: number;
}
