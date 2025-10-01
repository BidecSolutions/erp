import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateAnnualLeaveDto {

    @IsString()
    @IsOptional()
    name?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  total_leave?: number;
  
}
