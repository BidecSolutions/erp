import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveRequest } from './leave-request.entity';
import { LeaveRequestService } from './leave-request.service';
import { LeaveRequestController } from './leave-request.controller';
import { Employee } from '../hrm_employee/employee.entity';
import { LeaveType } from '../hrm_leave-type/leave-type.entity';
import { AnnualLeave } from '../hrm_annual-leave/annual-leave.entity';
import { UnpaidLeave } from '../hrm_unpaid-leave/unpaid-leave.entity';
import { NotificationModule } from '../hrm_notification/notification.module';
import { ProbationSetting } from '../hrm_probation-setting/probation-setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LeaveRequest, Employee, LeaveType, AnnualLeave, UnpaidLeave,ProbationSetting]),
  NotificationModule,
],
  providers: [LeaveRequestService],
  controllers: [LeaveRequestController],
})
export class LeaveRequestModule {}
