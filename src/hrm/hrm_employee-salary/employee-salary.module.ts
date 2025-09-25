import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeSalary } from './employee-salary.entity';
import { EmployeeSalaryService } from './employee-salary.service';
import { EmployeeSalaryController } from './employee-salary.controller';
import { Paysliptype } from 'src/hrm/hrm_paysliptype/paysliptype.entity';


@Module({
  imports: [TypeOrmModule.forFeature([EmployeeSalary, Paysliptype])],
  controllers: [EmployeeSalaryController],
  providers: [EmployeeSalaryService],
})
export class EmployeeSalaryModule {}
