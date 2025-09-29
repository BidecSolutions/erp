import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationType } from './notification-type.entity';
import { NotificationTypeService } from './notification-type.service';
import { NotificationTypeController } from './notification-type.controller';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationType])],
  providers: [NotificationTypeService],
  controllers: [NotificationTypeController],
})
export class NotificationTypeModule {}
