import { Controller, Post, Get, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { LeaveSetupService } from './leave-setup.service';
import { CreateLeaveSetupDto } from './dto/create-leave-setup.dto';
import { UpdateLeaveSetupDto } from './dto/update-leave-setup.dto';

@Controller('leave-setup')
export class LeaveSetupController {
  constructor(private readonly leaveSetupService: LeaveSetupService) {}

  @Post('create')
  create(@Body() dto: CreateLeaveSetupDto) {
    return this.leaveSetupService.create(dto);
  }

  @Get('list')
  findAll() {
    return this.leaveSetupService.findAll();
  }

  @Get(':id/get')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.leaveSetupService.findOne(id);
  }

  @Put(':id/update')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLeaveSetupDto) {
    return this.leaveSetupService.update(id, dto);
  }

  @Delete(':id/delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.leaveSetupService.remove(id);
  }
}
