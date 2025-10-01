import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { Notification } from './notification.entity';
import { NotificationType } from '../hrm_notification-type/notification-type.entity';
import { Employee } from '../hrm_employee/employee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, NotificationType, Employee]), // 👈 Employee add karo
  ],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
