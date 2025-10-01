import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateLeaveSetupDto {
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  total_leave: number;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  leave_remaining: number;

  @IsInt()
  @IsNotEmpty()
  year: number;
}
