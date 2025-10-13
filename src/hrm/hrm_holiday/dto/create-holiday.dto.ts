import { IsNotEmpty, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateHolidayDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  description?: string;
}
