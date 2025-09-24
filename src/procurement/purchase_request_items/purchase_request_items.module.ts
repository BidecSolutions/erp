import { Module } from '@nestjs/common';
import { PurchaseRequestItemsService } from './purchase_request_items.service';
import { PurchaseRequestItemsController } from './purchase_request_items.controller';
import { PurchaseRequestItem } from './entities/purchase_request_item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
   imports: [TypeOrmModule.forFeature([PurchaseRequestItem])],
  controllers: [PurchaseRequestItemsController],
  providers: [PurchaseRequestItemsService],
})
export class PurchaseRequestItemsModule {}
