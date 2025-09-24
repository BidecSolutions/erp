import { Module } from '@nestjs/common';
import { SalesOrderController } from './sales-order.controller';
import { SalesOrderService } from './sales-order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesOrder } from './entity/sales-order.entity';
import { SalesOrderDetail } from './entity/sales-order-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SalesOrder, SalesOrderDetail])],
  controllers: [SalesOrderController],
  providers: [SalesOrderService]
})
export class SalesOrderModule {}
