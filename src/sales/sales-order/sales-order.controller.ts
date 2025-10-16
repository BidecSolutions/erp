import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Patch,
  ParseIntPipe,
  Delete,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { SalesOrderService } from './sales-order.service';
import { CreateSalesOrderDto, UpdateSalesOrderDto } from './dto/sales-order.dto';
import { JwtEmployeeAuth } from 'src/auth/jwt-employee.guard';
import { CreateSalesReturnDto } from 'src/pos/dto/create-sales-return.dto';
// @UseGuards(JwtEmployeeAuth)
@Controller('sales-order')
export class SalesOrderController {
  constructor(private readonly salesOrderService: SalesOrderService) { }

  @Post('store')
  async create(@Body() dto: CreateSalesOrderDto) {
    return this.salesOrderService.store(dto);
  }

  @Post('create')
  async createSalesReturn(@Body()dto: CreateSalesReturnDto) {
    return this.salesOrderService.createSalesReturn(dto);
  }

  @Get('list')
  async findAll() {
    return this.salesOrderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.salesOrderService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateDto: CreateSalesOrderDto) {
    try {
      return await this.salesOrderService.update(+id, updateDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('toogleStatus/:id')
  statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.salesOrderService.statusUpdate(id);
  }
}
