import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@UseGuards(JwtAuthGuard)
@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

   @Get('list')
  findAll(@Query('status') status?: string) {
    const filterStatus = status !== undefined ? Number(status) : undefined;
    return this.departmentService.findAll(filterStatus);
  }

  @Get(':id/get')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.departmentService.findOne(id);
  }

  @Post('create')
  create(@Body() dto: CreateDepartmentDto) {
    return this.departmentService.create(dto);
  }
  
  @Put(':id/update')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDepartmentDto) {
    return this.departmentService.update(id, dto);
  }

  @Delete(':id/delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.departmentService.remove(id);
  }
     @Get('toogleStatus/:id')
      statusChange(@Param('id', ParseIntPipe) id: number){
        return this.departmentService.statusUpdate(id);
      }
}
