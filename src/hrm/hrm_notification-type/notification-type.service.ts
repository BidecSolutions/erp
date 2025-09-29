import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationType } from './notification-type.entity';
import { CreateNotificationTypeDto } from './dto/create-notification-type.dto';
import { UpdateNotificationTypeDto } from './dto/update-notification-type.dto';

@Injectable()
export class NotificationTypeService {
  constructor(
    @InjectRepository(NotificationType)
    private repo: Repository<NotificationType>,
  ) {}

  create(dto: CreateNotificationTypeDto) {
    const record = this.repo.create(dto);
    return this.repo.save(record);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) throw new NotFoundException('Notification Type not found');
    return record;
  }

  async update(id: number, dto: UpdateNotificationTypeDto) {
    const record = await this.findOne(id);
    Object.assign(record, dto);
    return this.repo.save(record);
  }

  async remove(id: number) {
    const record = await this.findOne(id);
    return this.repo.remove(record);
  }
}
