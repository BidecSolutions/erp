import { Module } from '@nestjs/common';
import { PurchaseOrderService } from './purchase_order.service';
import { PurchaseOrderController } from './purchase_order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrder } from './entities/purchase_order.entity';
import { PurchaseOrderItem } from './entities/purchase_order_items.entity';
import { PurchaseRequest } from '../purchase_request/entities/purchase_request.entity';

@Module({
  imports : [TypeOrmModule.forFeature([PurchaseOrder , PurchaseOrderItem ,PurchaseRequest])],
  controllers: [PurchaseOrderController],
  providers: [PurchaseOrderService],
})
export class PurchaseOrderModule {}
