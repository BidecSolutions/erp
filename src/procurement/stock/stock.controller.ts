import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post('store')
  create(@Body() createStockDto: CreateStockDto) {
    return this.stockService.create(createStockDto);
  }
  @Get('list')
  findAll(@Query('filter') filter?: string) {
    return this.stockService.findAll(
      filter !== undefined ? Number(filter) : undefined,
    );
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.stockService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateStockDto: UpdateStockDto) {
  //   return this.stockService.update(+id, updateStockDto);
  // // }

  // @Get('toogleStatus/:id')
  // statusChange(@Param('id', ParseIntPipe) id: number) {
  //   return this.stockService.statusUpdate(id);
  // }
 
}
