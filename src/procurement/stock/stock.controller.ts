import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockDto, UpdateStockDto } from './dto/create-stock.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) { }

  @Post('store')
  create(@Body() createStockDto: CreateStockDto, @Req() req: Request) {
    const companyId = req["user"].company_id;
    const userId = req["user"].user.id;
    return this.stockService.store(createStockDto, companyId, userId);
  }
  @Get('list')
  findAll(@Req() req: Request) {
    const companyId = req["user"].company_id;
    return this.stockService.findAll(companyId);
  }
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    const companyId = req["user"].company_id;
    return this.stockService.findOne(+id, companyId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStockDto: UpdateStockDto,
    @Req() req: Request) {
    const companyId = req["user"].company_id;
    const userId = req["user"].user.id;

    return this.stockService.update(+id, updateStockDto, companyId, userId);
  }

  @Get('toogleStatus/:id')
  statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.stockService.statusUpdate(id);
  }

}
