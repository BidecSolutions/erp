import { Controller, Post, Get, Put, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AnnualLeaveService } from './annual-leave.service';
import { CreateAnnualLeaveDto } from './dto/create-annual-leave.dto';
import { UpdateAnnualLeaveDto } from './dto/update-annual-leave.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

UseGuards(JwtAuthGuard)
@Controller('annual-leave')
export class AnnualLeaveController {
  constructor(private readonly annualleaveService: AnnualLeaveService) { }

  @Post('create')
  create(@Body() dto: CreateAnnualLeaveDto) {
    return this.annualleaveService.create(dto);
  }

  @Get('list')
  findAll() {
    return this.annualleaveService.findAll();
  }

  @Get(':id/get')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.annualleaveService.findOne(id);
  }

  @Put(':id/update')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAnnualLeaveDto) {
    return this.annualleaveService.update(id, dto);
  }

  @Delete(':id/delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.annualleaveService.remove(id);
  }
}
