import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { Employee } from './employee.entity';
import { Department } from '../hrm_department/department.entity';
import { Designation } from '../hrm_designation/designation.entity';
import { BankDetail } from '../hrm_bank-details/bank-detail.entity';
import { BankDetailModule } from '../hrm_bank-details/bank-details.module';
import { Shift } from '../hrm_shift/shift.entity';
import { DocumentModule } from '../hrm_document/document.module';
// import { LeaveModule } from '../hrm_leave/leave.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, Department, Designation, Shift]),
    BankDetailModule ,
    DocumentModule,
    // LeaveModule
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
