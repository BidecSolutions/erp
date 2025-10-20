import { IsNotEmpty, IsNumber, IsString, IsDateString, IsOptional } from 'class-validator';
import { LeaveStatus } from '../leave-request.entity';

export class CreateLeaveRequestDto {
  @IsNotEmpty({ message: 'Employee ID is required' })
  @IsNumber({}, { message: 'Employee ID must be a number' })
  emp_id: number;

  @IsNotEmpty({ message: 'Leave Type ID is required' })
  @IsNumber({}, { message: 'Leave Type ID must be a number' })
  leave_type_id: number;

  @IsNotEmpty({ message: 'Number of leaves is required' })
  @IsNumber({}, { message: 'Number of leaves must be a number' })
  number_of_leave: number;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsNotEmpty({ message: 'Start date is required' })
  @IsDateString({}, { message: 'Start date must be a valid date string (YYYY-MM-DD)' })
  start_date: string;

  @IsNotEmpty({ message: 'End date is required' })
  @IsDateString({}, { message: 'End date must be a valid date string (YYYY-MM-DD)' })
  end_date: string;

  @IsOptional()
  @IsNumber({}, { message: 'Status must be a number (1 = pending, 2 = approved, 3 = rejected)' })
  status?: LeaveStatus; // default = pending
}
