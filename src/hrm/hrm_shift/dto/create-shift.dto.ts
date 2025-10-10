import { IsNotEmpty, IsString } from 'class-validator';

export class CreateShiftDto {
  @IsNotEmpty()
  @IsString()
  name: string;

   @IsString()
  @IsNotEmpty()
  start_time: string; 

  @IsString()
  @IsNotEmpty()
  end_time: string; 
}
