import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PosService } from './pos.service';
import { PosController } from './pos.controller';
import { StockAdjustment } from 'src/procurement/stock_adjustment/entities/stock_adjustment.entity';
import { SalesOrder } from 'src/sales/sales-order/entity/sales-order.entity';
import { SalesOrderDetail } from 'src/sales/sales-order/entity/sales-order-detail.entity';

import { ProductModule } from 'src/procurement/product/product.module';
import { CustomerModule } from 'src/Company/customers/customer.module';

@Module({
  imports: [ProductModule,
    CustomerModule,
    TypeOrmModule.forFeature([
      StockAdjustment,
      SalesOrder,
      SalesOrderDetail,
    ]),
  ],
  providers: [PosService],
  controllers: [PosController],
})
export class PosModule { }
