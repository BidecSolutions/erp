import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PurchaseRequestItemsService } from './purchase_request_items.service';
import { CreatePurchaseRequestItemDto } from './dto/create-purchase_request_item.dto';
import { UpdatePurchaseRequestItemDto } from './dto/update-purchase_request_item.dto';

@Controller('purchase-request-items')
export class PurchaseRequestItemsController {
  constructor(private readonly purchaseRequestItemsService: PurchaseRequestItemsService) {}

  @Post()
  create(@Body() createPurchaseRequestItemDto: CreatePurchaseRequestItemDto) {
    return this.purchaseRequestItemsService.create(createPurchaseRequestItemDto);
  }

  @Get()
  findAll() {
    return this.purchaseRequestItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseRequestItemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePurchaseRequestItemDto: UpdatePurchaseRequestItemDto) {
    return this.purchaseRequestItemsService.update(+id, updatePurchaseRequestItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseRequestItemsService.remove(+id);
  }
}
