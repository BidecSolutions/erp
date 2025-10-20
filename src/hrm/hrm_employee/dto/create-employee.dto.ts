// import {
//   IsString,
//   IsEmail,
//   IsNotEmpty,
//   IsNumber,
//   Length,
//   IsDateString,
//   IsOptional,
//   IsEnum,
//   Matches,
//   ValidateNested,
//   IsArray,
//   ValidateIf,
//   IsBoolean,
//   IsInt,
//   ArrayNotEmpty,
//   ArrayMaxSize,
//   ArrayMinSize,
// } from "class-validator";
// import { Transform, Type } from "class-transformer";
// import { CreateBankDetailDto } from "src/hrm/hrm_bank-details/dto/create-bank-details.dto";
// import { EmployeeType } from "../employee.entity";
// import { CreateEmpRoasterDto } from "src/hrm/hrm_shift/dto/create-emp-roaster.dto";

// export class CreateEmployeeDto {
//   @IsString()
//   @IsNotEmpty({ message: "Name is required" })
//   @Length(3, 50)
//   name: string;

//   @IsString()
//   @IsNotEmpty({ message: "Phone is required" })
//   @Matches(/^\d{11}$/, { message: "Phone must be exactly 11 digits" })
//   phone: string;

//   @IsString()
//   @IsNotEmpty({ message: "Gender is required" })
//   gender: string;

//   @IsEmail()
//   email?: string;

//   @IsString()
//   @Length(6, 100)
//   password?: string;

//   @IsString()
//   @IsNotEmpty({ message: "Address is required" })
//   address: string;

//   @IsDateString()
//   @IsNotEmpty({ message: "Date of birth is required" })
//   dateOfBirth: string;

//   @IsOptional()
//   @IsEnum(["residential", "postal", "work address"], {
//     message: "Location type must be one of: residential, postal, work address",
//   })
//   locationType?: "residential" | "postal" | "work address";

//   @IsNumber({}, { message: "Department ID must be a number" })
//   @IsNotEmpty({ message: "Department is required" })
//   @Type(() => Number)
//   departmentId: number;

//   @IsNumber({}, { message: "Designation ID must be a number" })
//   @IsNotEmpty({ message: "Designation is required" })
//   @Type(() => Number)
//   designationId: number;

//   @IsDateString()
//   @IsNotEmpty({ message: "Date of joining is required" })
//   dateOfJoining: string;

//   //  @IsNotEmpty({ message: 'CV is required' })
//   // cv: Express.Multer.File;

//   // @IsNotEmpty({ message: 'Photo is required' })
//   // photo: Express.Multer.File;

//   // @IsArray()
//   // @IsArray({ message: 'Identity Card must have exactly 2 files' })

//   // identity_card: Express.Multer.File[];

//   // @IsOptional()
//   // academic_transcript?: Express.Multer.File;

//   // // Multiple bank details allowed
//   @IsOptional()
//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => CreateBankDetailDto)
//   bankDetails?: CreateBankDetailDto[];


//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => CreateEmpRoasterDto)
//   roasters?: CreateEmpRoasterDto[];



//   @IsOptional()
//   @IsNumber()
//   @Type(() => Number)
//   hoursPerDay?: number;

//   @IsOptional()
//   @IsNumber()
//   @Type(() => Number)
//   daysPerWeek?: number;

//   @IsOptional()
//   @IsNumber()
//   @Type(() => Number)
//   hoursPerMonth?: number;

//   @IsOptional()
//   @IsNumber()
//   @Type(() => Number)
//   daysPerMonth?: number;

//   @IsOptional()
//   @IsNumber()
//   @Type(() => Number)
//   annualSalary?: number;

//   @IsNotEmpty({ message: "Salary is required" })
//   @IsNumber()
//   @Type(() => Number)
//   fixedSalary: number;

//   @IsOptional()
//   @IsNumber()
//   @Type(() => Number)
//   ratePerDay?: number;

//   @IsOptional()
//   @IsNumber()
//   @Type(() => Number)
//   ratePerHour?: number;

//   // @IsNumber({}, { message: "Shift ID must be a number" })
//   // @IsNotEmpty({ message: "Shift is required" })
//   // @Type(() => Number)
//   // shiftId: number;

//   @IsBoolean()
//   @Transform(({ value }) => {
//     if (value === undefined || value === null) return false; // default
//     if (value === "true" || value === true) return true;
//     if (value === "false" || value === false) return false;
//     return false; // fallback
//   })
//   is_system_user: boolean = false; // default value

//   @ValidateIf((o) => o.emp_type === EmployeeType.Permanent)
//   @IsOptional({
//     message: "annual_leave_id is required for permanent employees",
//   })
//   @IsInt({ message: "annual_leave_id must be an integer number" })
//   @Type(() => Number)
//   annual_leave_id?: number;

//   //  Probation setting ID -> sirf PROBATION employees ke liye
//   @ValidateIf((o) => o.emp_type === EmployeeType.Probation)
//   @IsOptional({
//     message: "probation_setting_id is required for probation employees",
//   })
//   @IsInt({ message: "probation_setting_id must be an integer number" })
//   @Type(() => Number)
//   probation_setting_id?: number;

//   @IsOptional()
//   @IsArray()
//   @Type(() => Number)
//   @IsNumber({}, { each: true })
//   allowance_ids?: number[];

//   @IsOptional()
//   @IsNumber()
//   @Type(() => Number)
//   role_id?: number;

//   @IsEnum(EmployeeType, { message: "emp_type must be Probation or Permanent" })
//   @IsNotEmpty({ message: "emp_type is required" })
//   emp_type: EmployeeType;

//   @IsNotEmpty({ message: "Branch Id is Requeired" })
//   @IsArray()
//   @Type(() => Number)
//   @IsNumber({}, { each: true })
//   branch_id: number[];
// }
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
} from "class-validator";
import { Transform, Type } from "class-transformer";
import { CreateBankDetailDto } from "src/hrm/hrm_bank-details/dto/create-bank-details.dto";
import { EmployeeType } from "../employee.entity";
import { CreateEmpRoasterDto } from "src/hrm/hrm_shift/dto/create-emp-roaster.dto";

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  @Length(3, 50, { message: "Name must be between 3 and 50 characters" })
  name: string;

  @IsString()
  @IsNotEmpty({ message: "Phone is required" })
  @Matches(/^\d{11}$/, { message: "Phone must be exactly 11 digits" })
  phone: string;

  @IsString()
  @IsNotEmpty({ message: "Address is required" })
  address: string;

  @IsString()
  @IsNotEmpty({ message: "Gender is required" })
  gender: string;

  @IsDateString()
  @IsNotEmpty({ message: "Date of birth is required" })
  dateOfBirth: string;

  @IsNumber({}, { message: "Department ID must be a number" })
  @IsNotEmpty({ message: "Department is required" })
  @Type(() => Number)
  departmentId: number;

  @IsNumber({}, { message: "Designation ID must be a number" })
  @IsNotEmpty({ message: "Designation is required" })
  @Type(() => Number)
  designationId: number;

  @IsDateString({}, { message: "Invalid date format for dateOfJoining" })
  @IsNotEmpty({ message: "Date of joining is required" })
  dateOfJoining: string;

  @IsNotEmpty({ message: "Salary is required" })
  @IsNumber()
  @Type(() => Number)
  fixedSalary: number;

  @IsEnum(EmployeeType, { message: "emp_type must be Probation or Permanent" })
  @IsNotEmpty({ message: "emp_type is required" })
  emp_type: EmployeeType;

  @IsNotEmpty({ message: "Branch Id is Requeired" })
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  branch_id: number[];

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(6, 100)
  password?: string;

  @IsOptional()
  @IsEnum(["residential", "postal", "work address"], {
    message: "Location type must be one of: residential, postal, work address",
  })
  locationType?: "residential" | "postal" | "work address";

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBankDetailDto)
  bankDetails?: CreateBankDetailDto[];

  @IsArray()
  @ArrayNotEmpty({ message: "At least one roster is required" })
  @ValidateNested({ each: true })
  @Type(() => CreateEmpRoasterDto)
  roasters?: CreateEmpRoasterDto[];

  //   @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => CreateEmpRoasterDto)
  // roasters?: CreateEmpRoasterDto[];

  @IsOptional()
  @IsNumber({}, { message: "hoursPerDay must be a number" })
  @Type(() => Number)
  hoursPerDay?: number;

  @IsOptional()
  @IsNumber({}, { message: "daysPerWeek must be a number" })
  @Type(() => Number)
  daysPerWeek?: number;

  @IsOptional()
  @IsNumber({}, { message: "hoursPerMonth must be a number" })
  @Type(() => Number)
  hoursPerMonth?: number;

  @IsOptional()
  @IsNumber({}, { message: "daysPerMonth must be a number" })
  @Type(() => Number)
  daysPerMonth?: number;

  @IsOptional()
  @IsNumber({}, { message: "annualSalary must be a number" })
  @Type(() => Number)
  annualSalary?: number;


  @IsOptional()
  @IsNumber({}, { message: "ratePerDay must be a number" })
  @Type(() => Number)
  ratePerDay?: number;

  @IsOptional()
  @IsNumber({}, { message: "ratePerHour must be a number" })
  @Type(() => Number)
  ratePerHour?: number;

  @IsBoolean()
  @Transform(({ value }) => ["true", true].includes(value))
  is_system_user: boolean = false;

  @ValidateIf((o) => o.emp_type === EmployeeType.Permanent)
  @IsNotEmpty({ message: "annual_leave_id is required for permanent employees" })
  @IsInt({ message: "annual_leave_id must be an integer number" })
  @Type(() => Number)
  annual_leave_id?: number;

  @ValidateIf((o) => o.emp_type === EmployeeType.Probation)
  @IsNotEmpty({ message: "probation_setting_id is required for probation employees" })
  @IsInt({ message: "probation_setting_id must be an integer number" })
  @Type(() => Number)
  probation_setting_id?: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true, message: "Each allowance_id must be a number" })
  @Type(() => Number)
  allowance_ids?: number[];

  @IsOptional()
  @IsNumber({}, { message: "role_id must be a number" })
  @Type(() => Number)
  role_id?: number;

}
