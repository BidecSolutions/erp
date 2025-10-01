import { Controller, Get, Post, Body, Param, Patch, Delete, Put, UseGuards } from '@nestjs/common';
import { LeaveTypeService } from './leave-type.service';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
import { UpdateLeaveTypeDto } from './dto/update-leave-type.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


UseGuards(JwtAuthGuard)
@Controller('leave-type')
export class LeaveTypeController {
  constructor(private readonly leaveTypeService: LeaveTypeService) { }

  @Post('create')
  create(@Body() dto: CreateLeaveTypeDto) {
    return this.leaveTypeService.create(dto);
  }

  @Get('list')
  findAll() {
    return this.leaveTypeService.findAll();
  }

  @Get(':id/get')
  findOne(@Param('id') id: number) {
    return this.leaveTypeService.findOne(+id);
  }

  @Put(':id/update')
  update(@Param('id') id: number, @Body() dto: UpdateLeaveTypeDto) {
    return this.leaveTypeService.update(+id, dto);
  }

  @Delete(':id/delete')
  remove(@Param('id') id: number) {
    return this.leaveTypeService.remove(+id);
  }
}
