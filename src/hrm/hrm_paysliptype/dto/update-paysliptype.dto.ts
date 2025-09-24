import { IsOptional, IsString, Length } from 'class-validator';

export class UpdatePaysliptypeDto {
  @IsOptional()
  @IsString({ message: 'Payslip Type name must be a string' })
  name?: string;
}
