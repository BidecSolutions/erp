import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { PurchaseRequestService } from './purchase_request.service';
import { CreatePurchaseRequestDto } from './dto/create-purchase_request.dto';
import { UpdatePurchaseRequestDto } from './dto/update-purchase_request.dto';

@Controller('purchase-request')
export class PurchaseRequestController {
  constructor(private readonly purchaseRequestService: PurchaseRequestService) { }

   @Get('create')
  fetch() {
    return this.purchaseRequestService.create();
  }

  @Post('store')
  store(@Body() createPurchaseRequestDto: CreatePurchaseRequestDto) {
    return this.purchaseRequestService.store(createPurchaseRequestDto);
  }

  @Get('list')
  findAll(@Query('filter') filter?: string) {
    return this.purchaseRequestService.findAll(
      filter !== undefined ? Number(filter) : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseRequestService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePurchaseRequestDto: UpdatePurchaseRequestDto) {
    return this.purchaseRequestService.update(+id, updatePurchaseRequestDto);
  }

  @Get('toogleStatus/:id')
  statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.purchaseRequestService.statusUpdate(id);
  }


  @Post('approve')
  async approvePurchaseReq(
    @Param('id') id: number,
  ) {
    return this.purchaseRequestService.approvePr(id);

  }
}
