import { Controller, Post, Get, Param, Delete, Body, Put } from '@nestjs/common';
import { EmployeeSalaryService } from './employee-salary.service';
import { CreateEmployeeSalaryDto } from './dto/create-employee-salary.dto';
import { UpdateEmployeeSalaryDto } from './dto/update-employee-salary.dto';

@Controller('employee-salary')
export class EmployeeSalaryController {
  constructor(private readonly salaryService: EmployeeSalaryService) {}

  @Post('create')
  create(@Body() dto: CreateEmployeeSalaryDto) {
    return this.salaryService.create(dto);
  }

  @Get('list')
  findAll() {
    return this.salaryService.findAll();
  }

  @Get(':id/get')
  findOne(@Param('id') id: number) {
    return this.salaryService.findOne(id);
  }

  @Put(':id/update')
  update(@Param('id') id: number, @Body() dto: UpdateEmployeeSalaryDto) {
    return this.salaryService.update(id, dto);
  }

  @Delete(':id/delete')
  remove(@Param('id') id: number) {
    return this.salaryService.remove(id);
  }
}
