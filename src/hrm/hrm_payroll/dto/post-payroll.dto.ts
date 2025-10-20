import { IsInt, IsNotEmpty } from 'class-validator';

export class PostPayrollDto {
  @IsInt({ message: 'Payroll ID must be an integer.' })
  @IsNotEmpty({ message: 'Payroll ID is required.' })
  payroll_id: number;
}
