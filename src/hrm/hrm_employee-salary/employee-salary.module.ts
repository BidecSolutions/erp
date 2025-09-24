import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeSalary } from './employee-salary.entity';
import { EmployeeSalaryService } from './employee-salary.service';
import { EmployeeSalaryController } from './employee-salary.controller';
import { Paysliptype } from 'src/hrm/hrm_paysliptype/paysliptype.entity';
import { Account } from 'src/hrm/hrm_account/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeSalary, Paysliptype, Account])],
  controllers: [EmployeeSalaryController],
  providers: [EmployeeSalaryService],
})
export class EmployeeSalaryModule {}
