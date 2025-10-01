import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  Length,
  IsDateString,
  IsOptional,
  IsEnum,
  Matches,
  ValidateNested,
  IsArray,
  ValidateIf,
  IsBoolean,
  IsInt,
  ArrayNotEmpty,
  ArrayMaxSize,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CreateBankDetailDto } from 'src/hrm/hrm_bank-details/dto/create-bank-details.dto';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @Length(3, 50)
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone is required' })
  @Matches(/^\d{11}$/, { message: 'Phone must be exactly 11 digits' })
  phone: string;

  @IsString()
  @IsNotEmpty({ message: 'Gender is required' })
  gender: string;


  @IsEmail()
  email?: string;


  @IsString()
  @Length(6, 100)
  password?: string;

  @IsString()
  @IsNotEmpty({ message: 'Address is required' })
  address: string;

  @IsDateString()
  @IsNotEmpty({ message: 'Date of birth is required' })
  dateOfBirth: string;

  @IsOptional()
  @IsEnum(['residential', 'postal', 'work address'], {
    message: 'Location type must be one of: residential, postal, work address',
  })
  locationType?: 'residential' | 'postal' | 'work address';

  @IsNumber({}, { message: 'Department ID must be a number' })
  @IsNotEmpty({ message: 'Department is required' })
  @Type(() => Number)
  departmentId: number;

  @IsNumber({}, { message: 'Designation ID must be a number' })
  @IsNotEmpty({ message: 'Designation is required' })
  @Type(() => Number)
  designationId: number;

  @IsDateString()
  @IsNotEmpty({ message: 'Date of joining is required' })
  dateOfJoining: string;

   @IsOptional()
  @IsString({ message: 'CV must be a valid string (file name)' })
  cv?: string; // file name after upload

  @IsOptional()
  @IsString({ message: 'Photo must be a valid string (file name)' })
  photo?: string;

  @IsOptional()
  @IsString({ message: 'Academic Transcript must be a valid string (file name)' })
  academic_transcript?: string;

  @IsOptional()
  @IsArray({ message: 'Identity Card must be an array of file names' })
  @ArrayMaxSize(2, { message: 'Identity Card can have maximum 2 files (front and back)' })
  identity_card?: string[]

  // ✅ Multiple bank details allowed
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBankDetailDto)
  bankDetails?: CreateBankDetailDto[];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  hoursPerDay?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  daysPerWeek?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  hoursPerMonth?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  daysPerMonth?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  annualSalary?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  fixedSalary?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ratePerDay?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ratePerHour?: number;

  @IsNumber({}, { message: 'Shift ID must be a number' })
  @IsNotEmpty({ message: 'Shift is required' })
  @Type(() => Number)
  shiftId: number;


  @IsBoolean()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return false; // default
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return false; // fallback
  })
  is_system_user: boolean = false; // default value

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'annual_leave_id must be an integer number' })
  annual_leave_id?: number;


  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  allowance_ids?: number[];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  role_id?: number;


@IsOptional()
@IsArray()
@Type(() => Number)
@IsNumber({}, { each: true })
branch_ids?: number[];


}
