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
} from '@nestjs/common';
import { SalesOrderService } from './sales-order.service';
import { CreateSalesOrderDto, UpdateSalesOrderDto } from './dto/sales-order.dto';

@Controller('sales-order')
export class SalesOrderController {
  constructor(private readonly salesOrderService: SalesOrderService) { }

  @Post('store')
  async create(@Body() dto: CreateSalesOrderDto) {
    return this.salesOrderService.store(dto);
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
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSalesOrderDto,
  ) {
    return this.salesOrderService.update(id, dto);
  }

  @Get('toogleStatus/:id')
  statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.salesOrderService.statusUpdate(id);
  }
}
