import { Controller, Post, Get, Param, Delete, Body, Put } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { CreateCommissionDto } from './dto/create-commission.dto';
import { UpdateCommissionDto } from './dto/update-commission.dto';

@Controller('commissions')
export class CommissionController {
  constructor(private readonly commissionService: CommissionService) {}

  @Post('create')
  create(@Body() dto: CreateCommissionDto) {
    return this.commissionService.create(dto);
  }

  @Get('list')
  findAll() {
    return this.commissionService.findAll();
  }

  @Get(':id/get')
  findOne(@Param('id') id: number) {
    return this.commissionService.findOne(id);
  }

  @Put(':id/update')
  update(@Param('id') id: number, @Body() dto: UpdateCommissionDto) {
    return this.commissionService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.commissionService.remove(id);
  }
}
