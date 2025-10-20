import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAttendanceDto {
  @IsInt({ message: 'Employee ID must be a number' })
  @Type(() => Number)
  employeeId: number;

  // Optional check-in time in HH:MM:SS format
  @IsOptional()
  @IsString({ message: 'Check-in time must be a string in HH:MM:SS format' })
  check_in?: string;

  // Optional check-out time in HH:MM:SS format
  @IsOptional()
  @IsString({ message: 'Check-out time must be a string in HH:MM:SS format' })
  check_out?: string;
}
