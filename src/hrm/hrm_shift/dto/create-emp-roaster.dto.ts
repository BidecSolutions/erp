import { IsArray, IsInt, IsOptional, IsString, IsNotEmpty, ArrayNotEmpty } from "class-validator";
import { Type } from "class-transformer";

export class CreateEmpRoasterDto {
  @IsArray({ message: "Days must be an array" })
  @ArrayNotEmpty({ message: "At least one day is required" })
  @IsString({ each: true, message: "Each day must be a string" })
  days: string[];

  @IsInt({ message: "Shift ID must be a number" })
  @Type(() => Number)
  @IsNotEmpty({ message: "Shift ID is required" })
  shift_id: number;

  @IsString({ message: "Start time must be a string" })
  @IsNotEmpty({ message: "Start time is required" })
  start_time: string;

  @IsString({ message: "End time must be a string" })
  @IsNotEmpty({ message: "End time is required" })
  end_time: string;
}
