import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { DesignationService } from './designation.service';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


UseGuards(JwtAuthGuard)
@Controller('designations')
export class DesignationController {
  constructor(private readonly designationService: DesignationService) { }

  @Get('list')
  findAll() {
    return this.designationService.findAll();
  }

  @Post('create')
  create(@Body() dto: CreateDesignationDto) {
    return this.designationService.create(dto);
  }

  @Get(':id/get')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.designationService.findOne(id);
  }

  @Put(':id/update')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDesignationDto) {
    return this.designationService.update(id, dto);
  }

  @Delete(':id/delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.designationService.remove(id);
  }
}
