import { Controller, Post, Get, Param, Delete, Body, Put } from '@nestjs/common';
import { LoanService } from './loan.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';

@Controller('loan')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post('create')
  create(@Body() dto: CreateLoanDto) {
    return this.loanService.create(dto);
  }

  @Get('list')
  findAll() {
    return this.loanService.findAll();
  }

  @Get(':id/get')
  findOne(@Param('id') id: number) {
    return this.loanService.findOne(id);
  }

  @Put(':id/update')
  update(@Param('id') id: number, @Body() dto: UpdateLoanDto) {
    return this.loanService.update(id, dto);
  }

  @Delete(':id/delete')
  remove(@Param('id') id: number) {
    return this.loanService.remove(id);
  }
}
