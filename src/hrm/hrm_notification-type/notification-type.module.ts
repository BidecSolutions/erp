import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationType } from './notification-type.entity';
import { NotificationTypeService } from './notification-type.service';
import { NotificationTypeController } from './notification-type.controller';
import { Company } from 'src/Company/companies/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationType, Company])],
  providers: [NotificationTypeService],
  controllers: [NotificationTypeController],
})
export class NotificationTypeModule {}
