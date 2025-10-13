import { IsInt, IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';


export class CreateAttendanceDto {
@IsInt()
@Type(() => Number)
employeeId: number;


// @IsDateString()
// date: string; // 'YYYY-MM-DD'


@IsOptional()
@IsString()
check_in?: string; // 'HH:MM:SS' (if provided by client)


@IsOptional()
@IsString()
check_out?: string; // 'HH:MM:SS'
}