import { Controller, Post, Get, Param, Patch, Delete, Body } from '@nestjs/common';
import { NotificationTypeService } from './notification-type.service';
import { CreateNotificationTypeDto } from './dto/create-notification-type.dto';
import { UpdateNotificationTypeDto } from './dto/update-notification-type.dto';

@Controller('notification-type')
export class NotificationTypeController {
  constructor(private readonly service: NotificationTypeService) {}

  @Post('create')
  create(@Body() dto: CreateNotificationTypeDto) {
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
  update(@Param('id') id: number, @Body() dto: UpdateNotificationTypeDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id/delete')
  remove(@Param('id') id: number) {
    return this.service.remove(+id);
  }
}
