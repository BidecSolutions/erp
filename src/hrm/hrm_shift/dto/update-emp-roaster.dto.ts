import { Type } from 'class-transformer';
import { IsOptional, IsInt, IsArray, IsString } from 'class-validator';

export class UpdateEmpRoasterDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id: number; // Required for update

  @IsOptional()
  @IsArray({ message: "Days must be an array" })
  @IsString({ each: true, message: "Each day must be a string" })
  days: string[];

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  shift_id: number;

  @IsOptional()
  @IsString()
  start_time: string;

  @IsOptional()
  @IsString()
  end_time: string;
}