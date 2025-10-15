import { Type } from 'class-transformer';
import { CreateEmpRoasterDto } from './create-emp-roaster.dto';
import { IsOptional, IsInt, IsArray, ArrayNotEmpty, IsString } from 'class-validator';

export class UpdateEmpRoasterDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number; // optional ID for existing roasters

   @IsArray({ message: "Days must be an array" })
     @IsOptional()
    @IsString({ each: true, message: "Each day must be a string" })
    days: string[]; // ✅ array of days
    
    @IsInt()
    @Type(() => Number)
      @IsOptional()
    shift_id: number;
  
    @IsString()
     @IsOptional()
    start_time: string;
  
    @IsString()
     @IsOptional()
    end_time: string;
  
}
