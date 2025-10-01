import { Module } from '@nestjs/common';
import { PurchaseRequestService } from './purchase_request.service';
import { PurchaseRequestController } from './purchase_request.controller';
import { TypeORMError } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseRequest } from './entities/purchase_request.entity';
import { PurchaseRequestItem } from './entities/purchase-request-item.entity';
import { ModuleType } from '../module_type/entities/module_type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseRequest , PurchaseRequestItem,ModuleType])],
  controllers: [PurchaseRequestController],
  providers: [PurchaseRequestService],
})
export class PurchaseRequestModule {}
