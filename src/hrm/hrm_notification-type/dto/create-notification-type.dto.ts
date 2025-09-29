import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationTypeDto {
  @IsNotEmpty()
  @IsString()
  type: string;
}
