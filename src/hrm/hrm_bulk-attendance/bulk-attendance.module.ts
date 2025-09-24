import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BulkAttendanceService } from './bulk-attendance.service';
import { BulkAttendanceController } from './bulk-attendance.controller';
import { Employee } from '../hrm_employee/employee.entity';
import { Attendance } from '../hrm_mark-attendance/mark-attendance.entity';
import { AttendanceService } from '../hrm_mark-attendance/mark-attendance.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, Attendance]), // 👈 yahan Employee aur Attendance dono
  ],
  controllers: [BulkAttendanceController],
  providers: [BulkAttendanceService, AttendanceService],
})
export class BulkAttendanceModule {}
