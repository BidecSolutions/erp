import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { CreatePurchaseGrnDto } from './dto/create-goods_receiving_note.dto';
import { GoodsReceivingNoteService } from './goods_receiving_note.service';
import { UpdatePurchaseGrnDto } from './dto/update-goods_receiving_note.dto';

@Controller('grn')
export class GoodsReceivingNoteController {
  constructor(private readonly goodsReceivingNoteService: GoodsReceivingNoteService) { }

  @Post('store')
  create(@Body() createGoodsReceivingNoteDto: CreatePurchaseGrnDto) {
    return this.goodsReceivingNoteService.store(createGoodsReceivingNoteDto);
  }

  @Get('list')
  findAll(@Query('filter') filter?: string) {
    return this.goodsReceivingNoteService.findAll(
      filter !== undefined ? Number(filter) : undefined,
    );
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.goodsReceivingNoteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePurchaseRequestDto: UpdatePurchaseGrnDto) {
    return this.goodsReceivingNoteService.update(+id, updatePurchaseRequestDto);
  }

  @Get('toogleStatus/:id')
  statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.goodsReceivingNoteService.statusUpdate(id);
  }

  @Post('partially_received')
  async partiallyReceived(
    @Param('id') id: number,
  ) {
    return this.goodsReceivingNoteService.partiallyReceived(id);

  }
  @Post('fully_received')
  async fullyReceived(
    @Param('id') id: number,
  ) {
    return this.goodsReceivingNoteService.fullyReceived(id);

  }


}
