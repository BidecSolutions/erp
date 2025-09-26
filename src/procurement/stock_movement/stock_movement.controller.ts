import { Controller, Get, Post, Body, Param, Delete, Query, Patch, ParseIntPipe } from '@nestjs/common';
import { StockMovementService } from './stock_movement.service';
import { CreateStockMovementDto } from './dto/create-stock_movement.dto';
import { UpdateStockMovementDto } from './dto/update-stock_movement.dto';


@Controller('stock-movements')
export class StockMovementController {
  constructor(private readonly stockMovementService: StockMovementService) {}
@Post('store')
  store(@Body() createWarehouseDto: CreateStockMovementDto) {
    return this.stockMovementService.store(createWarehouseDto);
  }

  @Get('list')
  findAll(@Query('filter') filter?: string) {
    return this.stockMovementService.findAll(
      filter !== undefined ? Number(filter) : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockMovementService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWarehouseDto: UpdateStockMovementDto) {
    return this.stockMovementService.update(+id, updateWarehouseDto);
  }

  @Get('toogleStatus/:id')
  statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.stockMovementService.statusUpdate(id);
  }

}
