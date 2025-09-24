import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { AllowanceOptionService } from './allowance-option.service';
import { CreateAllowanceOptionDto } from './dto/create-allowance-option.dto';
import { UpdateAllowanceOptionDto } from './dto/update-allowance-option.dto';

@Controller('allowance-option')
export class AllowanceOptionController {
  constructor(private readonly optionService: AllowanceOptionService) {}

  @Post('create')
  create(@Body() dto: CreateAllowanceOptionDto) {
    return this.optionService.create(dto);
  }

  @Get('list')
  findAll() {
    return this.optionService.findAll();
  }

  @Get(':id/get')
  findOne(@Param('id') id: number) {
    return this.optionService.findOne(+id);
  }

  @Put(':id/update')
  update(@Param('id') id: number, @Body() dto: UpdateAllowanceOptionDto) {
    return this.optionService.update(+id, dto);
  }

  @Delete(':id/delete')
  remove(@Param('id') id: number) {
    return this.optionService.remove(+id);
  }
}
