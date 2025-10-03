import { Module } from '@nestjs/common';
import { PurchaseQuatiationController } from './purchase_quotation.controller';
import { PurchaseQuotationService } from './purchase_quotation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseQuotation } from './entities/purchase_quotation.entity';
import { QuotationItem } from './entities/purchase_quotation_item.entity';
import { Supplier } from 'src/Company/supplier/supplier.entity';
import { PurchaseRequest } from '../purchase_request/entities/purchase_request.entity';

@Module({
  imports:[TypeOrmModule.forFeature([PurchaseQuotation , QuotationItem , Supplier ,PurchaseRequest])] ,
  controllers: [PurchaseQuatiationController],
  providers: [PurchaseQuotationService],
})
export class PurchaseQuotationModule {}
