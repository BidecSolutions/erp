import { IsString, IsOptional, IsInt, IsArray } from 'class-validator';
import { Type } from 'class-transformer';


export class AttendanceConfigDto {
@IsString()
office_start_time: string;


@IsString()
office_end_time: string;


@IsOptional()
@IsInt()
@Type(() => Number)
grace_period_minutes?: number;


@IsOptional()
@IsInt()
@Type(() => Number)
half_day_after_minutes?: number;


@IsOptional()
@IsInt()
@Type(() => Number)
overtime_after_minutes?: number;


@IsOptional()
@IsArray()
weekly_offs?: string[];
}