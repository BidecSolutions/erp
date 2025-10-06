import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { PurchaseOrderService } from './purchase_order.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase_order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase_order.dto';

@Controller('purchase-order')
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) { }

  @Post('store')
  store(@Body() createDto: CreatePurchaseOrderDto) {
    return this.purchaseOrderService.store(createDto);
  }
  @Get('list')
  findAll(@Query('filter') filter?: string) {
    return this.purchaseOrderService.findAll(
      filter !== undefined ? Number(filter) : undefined,
    );
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseOrderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBrandDto: UpdatePurchaseOrderDto) {
    return this.purchaseOrderService.update(+id, updateBrandDto);
  }
  @Get('toogleStatus/:id')
  statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.purchaseOrderService.statusUpdate(id);
  }
  @Post('approve')
  async approve(
    @Param('id') id: number,
  ) {
    return this.purchaseOrderService.approveOrder(id);
  }

}
