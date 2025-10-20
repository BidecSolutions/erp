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
  Req,
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
  async create(@Body() dto: CreateSalesOrderDto, @Req() req: any) {
    const user = req.user;
    return this.salesOrderService.store(dto, user);
  }

  @Post('create-return')
  async createSalesReturn(@Body() dto: CreateSalesReturnDto, @Req() req: any) {
    const user = req.user; 
    return this.salesOrderService.createSalesReturn(dto, user);
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
