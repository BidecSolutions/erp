import { Controller, Post, Get, Param, Patch, Delete, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @Post('create')
  create(@Body() dto: CreateNotificationDto) {
    return this.service.create(dto);
  }

  @Get('list')
  findAll() {
    return this.service.findAll();
  }

  @Get(':id/get')
  findOne(@Param('id') id: number) {
    return this.service.findOne(+id);
  }

  @Patch(':id/update')
  update(@Param('id') id: number, @Body() dto: UpdateNotificationDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id/delete')
  remove(@Param('id') id: number) {
    return this.service.remove(+id);
  }
}
