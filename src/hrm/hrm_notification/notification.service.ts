import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationReadStatus } from './notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Employee } from '../hrm_employee/employee.entity';
import { NotificationType } from '../hrm_notification-type/notification-type.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly repo: Repository<Notification>,
      @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
       @InjectRepository(NotificationType)
    private readonly notificationTypeRepository: Repository<NotificationType>,
  ) {}

async create(dto: CreateNotificationDto) {
  const employee = await this.employeeRepository.findOneBy({ id: dto.emp_id });
  const notificationType = await this.notificationTypeRepository.findOneBy({ id: dto.notification_type_id });

  const notification = this.repo.create({
    employee: employee!,
    notificationType: notificationType!,
    message: dto.message,
  });

  return this.repo.save(notification);
}


  async findAll() {
    return await this.repo.find({
      relations: ['employee', 'notificationType'],
    });
  }

  async findOne(id: number) {
    const record = await this.repo.findOne({
      where: { id },
      relations: ['employee', 'notificationType'],
    });
    if (!record) throw new NotFoundException('Notification not found');
    return record;
  }

  async update(id: number, dto: UpdateNotificationDto) {
    const record = await this.findOne(id);
    Object.assign(record, dto);
    return await this.repo.save(record);
  }

  async remove(id: number) {
    const record = await this.findOne(id);
    return await this.repo.remove(record);
  }

  // // Custom method to mark as read
  async markAsRead(id: number) {
    const record = await this.findOne(id);
    record.read_status = NotificationReadStatus.READ;
    return await this.repo.save(record);
  }

  // // Custom method to mark as unread
  async markAsUnread(id: number) {
    const record = await this.findOne(id);
    record.read_status = NotificationReadStatus.UNREAD;
    return await this.repo.save(record);
  }
}
