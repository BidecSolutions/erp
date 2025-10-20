import { IsNotEmpty, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateHolidayDto {
  @IsNotEmpty({ message: 'Holiday title is required' })
  @IsString({ message: 'Holiday title must be a string' })
  title: string;

  @IsNotEmpty({ message: 'Holiday date is required' })
  @IsDateString({}, { message: 'Holiday date must be a valid date string (YYYY-MM-DD)' })
  date: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;
}
