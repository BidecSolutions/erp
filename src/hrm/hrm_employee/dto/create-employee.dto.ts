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

  // ✅ validate email only when is_system_user === true
  @ValidateIf((o) => o.is_system_user === true)
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required for system users' })
  email?: string;

  // ✅ validate password only when is_system_user === true
  @ValidateIf((o) => o.is_system_user === true)
  @IsString()
  @IsNotEmpty({ message: 'Password is required for system users' })
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
  @IsString()
  cv?: string;

  @IsOptional()
  @IsString()
  photo?: string;

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

  // ✅ is_system_user flag
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  is_system_user: boolean;

  @IsOptional()
@IsNumber()
@Type(() => Number)
leaveId?: number;

}
