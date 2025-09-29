import { Controller, Post, Get, Param, Patch, Delete, Body } from '@nestjs/common';
import { UnpaidLeaveService } from './unpaid-leave.service';
import { CreateUnpaidLeaveDto } from './dto/create-unpaid-leave.dto';
import { UpdateUnpaidLeaveDto } from './dto/update-unpaid-leave.dto';

@Controller('unpaid-leave')
export class UnpaidLeaveController {
  constructor(private readonly service: UnpaidLeaveService) {}

  @Post('create')
  create(@Body() dto: CreateUnpaidLeaveDto) {
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
  update(@Param('id') id: number, @Body() dto: UpdateUnpaidLeaveDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id/delete')
  remove(@Param('id') id: number) {
    return this.service.remove(+id);
  }
}
