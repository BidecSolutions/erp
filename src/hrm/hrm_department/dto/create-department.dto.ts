import { IsString, Length, IsNotEmpty } from 'class-validator';

export class CreateDepartmentDto {
  @IsString({ message: 'Department name must be a string' })
<<<<<<< HEAD
  @Length(2, 50, { message: 'Department name must be between 3 and 50 characters' })
  name: string;



=======
  @IsNotEmpty({ message: 'Department name is required' })
  @Length(3, 50, { message: 'Department name must be between 3 and 50 characters' })
  name: string;
>>>>>>> 89ec5ccbf0a7f9d2d75a1913ce1499dd20e0c67d
}
