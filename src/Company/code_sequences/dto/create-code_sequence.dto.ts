import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';

export class CreateCodeSequenceDto {
  @IsString()
  @IsNotEmpty()
  module_name: string;

  @IsString()
  @IsNotEmpty()
  prefix: string;

  @IsInt()
  @Min(0)
  last_number: number;
}
