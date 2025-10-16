import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './attendance.entity';
import { AttendanceConfig } from './attendance-config.entity';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { Employee } from '../hrm_employee/employee.entity';
import { Holiday } from '../hrm_holiday/holiday.entity';
import { LeaveRequest } from '../hrm_leave-request/leave-request.entity';
import { userCompanyMapping } from 'src/entities/user-company-mapping.entity';

@Module({
  imports: [TypeOrmModule.forFeature([userCompanyMapping,Attendance, AttendanceConfig, Employee,Holiday,LeaveRequest])],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
