import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './attendance.entity';
import { AttendanceConfig } from './attendance-config.entity';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { Employee } from '../hrm_employee/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance, AttendanceConfig, Employee])],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
