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
import { Allowance } from '../hrm_allowance/allowance.entity';
import { AnnualLeave } from '../hrm_annual-leave/annual-leave.entity';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';
import { userRoleMapping } from 'src/entities/user-role-mapping.entity';
import { userCompanyMapping } from 'src/entities/user-company-mapping.entity';
import { Branch } from 'src/Company/branch/branch.entity';
import { ProbationSetting } from '../hrm_probation-setting/probation-setting.entity';
import { EmpRoaster } from '../hrm_shift/emp-roaster.entity';
import { ShiftModule } from '../hrm_shift/shift.module';
import { ShiftService } from '../hrm_shift/shift.service';
// import { LeaveModule } from '../hrm_leave/leave.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmpRoaster,userRoleMapping, userCompanyMapping, Employee, Department, Designation, Shift, AnnualLeave, BankDetail, Allowance, User, Role, Branch,ProbationSetting]),
    BankDetailModule,
    DocumentModule,
  
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService,ShiftService],
})
export class EmployeeModule { }
