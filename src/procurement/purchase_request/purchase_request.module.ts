import { Module } from '@nestjs/common';
import { PurchaseRequestService } from './purchase_request.service';
import { PurchaseRequestController } from './purchase_request.controller';
import { TypeORMError } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseRequest } from './entities/purchase_request.entity';
import { PurchaseRequestItem } from './entities/purchase-request-item.entity';
import { ModuleType } from '../module_type/entities/module_type.entity';
import { Stock } from '../stock/entities/stock.entity';
import { StockAdjustment } from '../stock_adjustment/entities/stock_adjustment.entity';
import { StockMovement } from '../stock_movement/entities/stock_movement.entity';
import { InternalTransferItem } from './entities/itr.items.entity';
import { InternalTransferRequest } from './entities/itr.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseRequest , PurchaseRequestItem,ModuleType ,Stock ,StockMovement ,InternalTransferItem ,InternalTransferRequest])],
  controllers: [PurchaseRequestController],
  providers: [PurchaseRequestService],
})
export class PurchaseRequestModule {}
