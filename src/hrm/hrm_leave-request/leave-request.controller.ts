import { Controller, Post, Get, Param, Body, Patch, Delete, Put, ParseIntPipe, Query } from '@nestjs/common';
import { LeaveRequestService } from './leave-request.service';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { UpdateLeaveRequestDto } from './dto/update-leave-request.dto';

@Controller('leave-request')
export class LeaveRequestController {
  constructor(private readonly service: LeaveRequestService) {}

  @Post('create')
  create(@Body() dto: CreateLeaveRequestDto) {
    return this.service.create(dto);
  }

    @Get('list')
  findAll(@Query('status') status?: string) {
    //  query param se status ko number me convert kar rahe
    const filterStatus = status !== undefined ? Number(status) : undefined;
    return this.service.findAll(filterStatus);
  }

  @Get(':id/get')
  findOne(@Param('id') id: number) {
    return this.service.findOne(+id);
  }

  @Put(':id/update')
  update(@Param('id') id: number, @Body() dto: UpdateLeaveRequestDto) {
    return this.service.update(+id, dto);
  }

   @Get('toogleStatus/:id')
    statusChange(@Param('id', ParseIntPipe) id: number){
      return this.service.statusUpdate(id);
    }

  @Put(':id/approve')
approve(@Param('id') id: number) {
  return this.service.approveLeaveRequest(+id);
}

@Put(':id/reject')
reject(@Param('id') id: number, @Body('reason') reason: string) {
  return this.service.rejectLeaveRequest(+id, reason);
}

}
