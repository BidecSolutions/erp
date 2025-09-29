import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveRequest } from './leave-request.entity';
import { LeaveRequestService } from './leave-request.service';
import { LeaveRequestController } from './leave-request.controller';
import { Employee } from '../hrm_employee/employee.entity';
import { LeaveType } from '../hrm_leave-type/leave-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LeaveRequest, Employee, LeaveType])],
  providers: [LeaveRequestService],
  controllers: [LeaveRequestController],
})
export class LeaveRequestModule {}
