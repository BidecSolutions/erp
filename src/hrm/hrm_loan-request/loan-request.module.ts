import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanRequestService } from './loan-request.service';
import { LoanRequestController } from './loan-request.controller';
import { LoanRequest } from './loan-request.entity';
import { Employee } from '../hrm_employee/employee.entity';
import { NotificationService } from '../hrm_notification/notification.service';
import { NotificationModule } from '../hrm_notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LoanRequest,
      Employee, // Employee entity required for salary checks
    ]),
       NotificationModule, 
  ],
  providers: [LoanRequestService],
  controllers: [LoanRequestController],
})
export class LoanRequestModule {}
