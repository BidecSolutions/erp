import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { PaysliptypeService } from './paysliptype.service';
import { CreatePaysliptypeDto } from './dto/create-paysliptype.dto';
import { UpdatePaysliptypeDto } from './dto/update-paysliptype.dto';

@Controller('paysliptypes')
export class PaysliptypeController {
    constructor(private readonly PaysliptypeService: PaysliptypeService) {}
    
      @Get('list')
      findAll() {
        return this.PaysliptypeService.findAll();
      }
    
      @Get(':id/get')
      findOne(@Param('id', ParseIntPipe) id: number) {
        return this.PaysliptypeService.findOne(id);
      }
    
      @Post('create')
      create(@Body() dto: CreatePaysliptypeDto) {
        return this.PaysliptypeService.create(dto);
      }
    
      @Put(':id/update')
      update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePaysliptypeDto) {
        return this.PaysliptypeService.update(id, dto);
      }
    
      @Delete(':id/delete')
      remove(@Param('id', ParseIntPipe) id: number) {
        return this.PaysliptypeService.remove(id);
      }
}
