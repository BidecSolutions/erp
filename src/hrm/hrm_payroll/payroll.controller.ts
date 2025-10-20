import { Controller, Post, Body } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { GeneratePayrollDto } from './dto/generate-payroll.dto';

@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post('generate')
  async generate(@Body() dto: GeneratePayrollDto) {
    return this.payrollService.generatePayroll(dto.employee_id, dto.month, dto.year);
  }
}
