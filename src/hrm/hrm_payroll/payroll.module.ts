import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollService } from './payroll.service';
import { PayrollController } from './payroll.controller';
import { Employee } from '../hrm_employee/employee.entity';
import { Attendance } from '../hrm_attendance/attendance.entity';
import { AttendanceConfig } from '../hrm_attendance/attendance-config.entity';
import { Allowance } from '../hrm_allowance/allowance.entity';
import { LoanRequest } from '../hrm_loan-request/loan-request.entity';
import { UnpaidLeave } from '../hrm_unpaid-leave/unpaid-leave.entity';
import { Payroll } from './entities/payroll.entity';
import { userCompanyMapping } from 'src/entities/user-company-mapping.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Employee,
      Attendance,
      AttendanceConfig,
      Allowance,
      LoanRequest,
      UnpaidLeave,
      Payroll,
      userCompanyMapping
    ]),
  ],
  providers: [PayrollService],
  controllers: [PayrollController],
})
export class PayrollModule {}
