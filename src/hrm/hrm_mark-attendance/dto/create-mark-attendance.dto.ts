import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateAttendanceDto {
  @IsNumber({}, { message: 'Employee ID must be a number' })
  @IsNotEmpty({ message: 'Employee is required' })
  employeeId: number;

  @IsString({ message: 'Date must be a string (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'Date is required' })
  date: string;

  @IsOptional()
  @IsString({ message: 'Clock In must be a string (HH:mm)' })
  clockIn?: string | null;

  @IsOptional()
  @IsString({ message: 'Clock Out must be a string (HH:mm)' })
  clockOut?: string | null;

  @IsOptional()
  @IsString()
  status?: string; // e.g. Present, Absent, Leave
  
@IsOptional()
@IsString()
late?: string | null;

@IsOptional()
@IsString()
earlyLeaving?: string | null;

@IsOptional()
@IsString()
overtime?: string | null;
}
