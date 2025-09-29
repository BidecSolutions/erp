import { IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateUnpaidLeaveDto {
  @IsNotEmpty({ message: 'Employee ID is required' })
  @IsInt({ message: 'Employee ID must be an integer' })
  employeeId: number;

  @IsNotEmpty({ message: 'Leave Request ID is required' })
  @IsInt({ message: 'Leave Request ID must be an integer' })
  leaveRequestId: number;

  @IsInt({ message: 'Extra days must be an integer' })
  @Min(1, { message: 'Extra days must be at least 1' })
  extra_days: number;
}
