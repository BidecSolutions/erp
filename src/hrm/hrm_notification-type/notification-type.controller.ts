import { Controller, Post, Get, Param, Patch, Delete, Body, Query, ParseIntPipe } from '@nestjs/common';
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
  findAll(@Query('status') status?: string) {
    const filterStatus = status !== undefined ? Number(status) : undefined;
    return this.service.findAll(filterStatus);
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

   @Get('toogleStatus/:id')
        statusChange(@Param('id', ParseIntPipe) id: number){
          return this.service.statusUpdate(id);
        }
}
