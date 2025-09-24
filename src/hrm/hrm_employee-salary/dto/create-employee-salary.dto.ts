import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEmployeeSalaryDto {
  @IsNumber({}, { message: 'Salary must be a number' })
  @IsNotEmpty({ message: 'Salary is required' })
  @Type(() => Number)
  salary: number;

  @IsNumber({}, { message: 'Payslip Type ID must be a number' })
  @IsNotEmpty({ message: 'Payslip Type is required' })
  @Type(() => Number)
  payslipType: number;

  @IsNumber({}, { message: 'Account Type ID must be a number' })
  @IsNotEmpty({ message: 'Account Type is required' })
  @Type(() => Number)
  accountType: number;
}
