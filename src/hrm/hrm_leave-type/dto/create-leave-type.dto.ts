import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLeaveTypeDto {
  @IsNotEmpty({ message: 'Leave type is required' })
  @IsString({ message: 'Leave type must be a string' })
  leave_type: string;
}
