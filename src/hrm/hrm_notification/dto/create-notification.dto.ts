import { IsNotEmpty, IsString, IsInt, IsNumber } from 'class-validator';

export class CreateNotificationDto {
  @IsNumber({}, { message: 'Employee ID must be a number' })
  @IsNotEmpty({ message: 'Employee ID is required' })
  emp_id: number;

  @IsString({ message: 'Message must be a string' })
  @IsNotEmpty({ message: 'Message is required' })
  message: string;

  @IsInt({ message: 'Notification type ID must be an integer' })
  @IsNotEmpty({ message: 'Notification type ID is required' })
  notification_type_id: number;
}
