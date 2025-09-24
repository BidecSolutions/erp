import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from '../hrm_employee/employee.entity';
import { Attendance } from './mark-attendance.entity';
import { AttendanceService } from './mark-attendance.service';
import { AttendanceController } from './mark-attendance.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Attendance, Employee])],
  providers: [AttendanceService],
  controllers: [AttendanceController],
})
export class AttendanceModule {}
