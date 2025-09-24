import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { DeductionOptionService } from './deduction-option.service';
import { CreateDeductionOptionDto } from './dto/create-deduction-option.dto';
import { UpdateDeductionOptionDto } from './dto/update-deduction-option.dto';

@Controller('deduction-option')
export class DeductionOptionController {
  constructor(private readonly deductionOptionService: DeductionOptionService) {}

  @Post('create')
  create(@Body() dto: CreateDeductionOptionDto) {
    return this.deductionOptionService.create(dto);
  }

  @Get('list')
  findAll() {
    return this.deductionOptionService.findAll();
  }

  @Get(':id/get')
  findOne(@Param('id') id: string) {
    return this.deductionOptionService.findOne(+id);
  }

  @Put(':id/update')
  update(@Param('id') id: string, @Body() dto: UpdateDeductionOptionDto) {
    return this.deductionOptionService.update(+id, dto);
  }

  @Delete(':id/delete')
  remove(@Param('id') id: string) {
    return this.deductionOptionService.remove(+id);
  }
}
