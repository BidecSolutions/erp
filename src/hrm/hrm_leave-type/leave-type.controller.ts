import { Controller, Get, Post, Body, Param, Patch, Delete, Put, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
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
   findAll(@Query('status') status?: string) {
     const filterStatus = status !== undefined ? Number(status) : undefined;
     return this.leaveTypeService.findAll(filterStatus);
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
      @Get('toogleStatus/:id')
        statusChange(@Param('id', ParseIntPipe) id: number){
          return this.leaveTypeService.statusUpdate(id);
        }
}
