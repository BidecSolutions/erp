import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsNotEmpty,
  ValidateIf,
  ArrayNotEmpty,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateEmpRoasterDto {
  @IsArray({ message: "Days must be an array" })
  @ArrayNotEmpty({ message: "Days are required" })
  @IsString({ each: true, message: "Each day must be a string" })
  days: string[]; // ✅ array of days
  
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty({ message: "Shift ID is required" })
  shift_id: number;

  @IsString()
  @IsNotEmpty({ message: "Start time is required" })
  start_time: string;

  @IsString()
  @IsNotEmpty({ message: "End time is required" })
  end_time: string;


}
