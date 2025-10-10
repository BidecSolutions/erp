import { Module } from '@nestjs/common';
import { PurchaseOrderService } from './purchase_order.service';
import { PurchaseOrderController } from './purchase_order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrder } from './entities/purchase_order.entity';
import { PurchaseOrderItem } from './entities/purchase_order_items.entity';
import { PurchaseRequest } from '../purchase_request/entities/purchase_request.entity';
import { PurchaseQuotation } from '../purchase_quotation/entities/purchase_quotation.entity';

@Module({
  imports : [TypeOrmModule.forFeature([PurchaseOrder ,PurchaseQuotation, PurchaseOrderItem ,PurchaseRequest])],
  controllers: [PurchaseOrderController],
  providers: [PurchaseOrderService],
})
export class PurchaseOrderModule {}
