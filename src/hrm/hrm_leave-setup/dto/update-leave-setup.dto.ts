import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateLeaveSetupDto {
  @IsInt()
  @Min(0)
  @IsOptional()
  total_leave?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  leave_remaining?: number;

  @IsInt()
  @IsOptional()
  year?: number;
}
