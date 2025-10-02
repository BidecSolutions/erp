import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationType } from './notification-type.entity';
import { CreateNotificationTypeDto } from './dto/create-notification-type.dto';
import { UpdateNotificationTypeDto } from './dto/update-notification-type.dto';
import { errorResponse, toggleStatusResponse } from 'src/commonHelper/response.util';

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

  findAll(filterStatus?: number) {
        const status = filterStatus !== undefined ? filterStatus : 1;
    return this.repo.find({where:{status}});
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

   async statusUpdate(id: number) {
      try {
        const dep = await this.repo.findOneBy({ id });
        if (!dep) throw new NotFoundException("Notification Type not found");
  
        dep.status = dep.status === 0 ? 1 : 0;
        await this.repo.save(dep);
  
        return toggleStatusResponse("Notification Type", dep.status);
      } catch (err) {
        return errorResponse("Something went wrong", err.message);
      }
    }
}
