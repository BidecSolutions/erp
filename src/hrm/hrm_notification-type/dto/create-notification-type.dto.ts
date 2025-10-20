import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationTypeDto {
  @IsNotEmpty({ message: 'Notification type is required' })
  @IsString({ message: 'Notification type must be a string' })
  type: string;
}
