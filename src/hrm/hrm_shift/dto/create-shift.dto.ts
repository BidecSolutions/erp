import { IsNotEmpty, IsString } from 'class-validator';

export class CreateShiftDto {
  @IsNotEmpty()
  @IsString()
  name: string;
<<<<<<< HEAD
=======

 
>>>>>>> 89ec5ccbf0a7f9d2d75a1913ce1499dd20e0c67d
}
