import { Module } from '@nestjs/common';
;
import { GoodsReceivingNoteController } from './goods_receiving_note.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseGrn } from './entities/goods_receiving_note.entity';
import { GoodsReceivingNoteService } from './goods_receiving_note.service';
import { PurchaseGrnItem } from './entities/goods_receiving_note-item.entity';
import { PurchaseOrder } from '../purchase_order/entities/purchase_order.entity';
import { Stock } from '../stock/entities/stock.entity';
import { StockMovement } from '../stock_movement/entities/stock_movement.entity';

@Module({
  imports:[TypeOrmModule.forFeature([PurchaseGrn ,PurchaseGrnItem, PurchaseOrder , Stock ,StockMovement ])],
  controllers: [GoodsReceivingNoteController],
  providers: [GoodsReceivingNoteService],
})
export class GoodsReceivingNoteModule {}
