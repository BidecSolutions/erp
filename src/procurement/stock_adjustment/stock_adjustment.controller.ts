import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { StockAdjustmentService } from './stock_adjustment.service';
import { CreateStockAdjustmentDto } from './dto/create-stock_adjustment.dto';
import { UpdateStockAdjustmentDto } from './dto/update-stock_adjustment.dto';

@Controller('stock-adjustment')
export class StockAdjustmentController {
  constructor(private readonly stockAdjustmentService: StockAdjustmentService) {}

  @Post('store')
  create(@Body() createStockAdjustmentDto: CreateStockAdjustmentDto) {
    return this.stockAdjustmentService.store(createStockAdjustmentDto);
  }

  @Get('list')
  findAll(@Query('filter') filter?: string) {
    return this.stockAdjustmentService.findAll(
      filter !== undefined ? Number(filter) : undefined,
    );
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockAdjustmentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStockAdjustmentDto: UpdateStockAdjustmentDto) {
    return this.stockAdjustmentService.update(+id, updateStockAdjustmentDto);
  }

  @Get('toogleStatus/:id')
   statusChange(@Param('id', ParseIntPipe) id: number) {
     return this.stockAdjustmentService.statusUpdate(id);
   }
}
