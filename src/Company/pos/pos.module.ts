import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PosService } from './pos.service';
import { PosController } from './pos.controller';
import { StockAdjustment } from 'src/procurement/stock_adjustment/entities/stock_adjustment.entity';
import { ProductService } from 'src/procurement/product/product.service';
import { CustomerService } from '../customers/customer.service';
import { StockAdjustmentService } from 'src/procurement/stock_adjustment/stock_adjustment.service';
import { SalesOrder } from 'src/sales/sales-order/entity/sales-order.entity';
import { SalesOrderDetail } from 'src/sales/sales-order/entity/sales-order-detail.entity';
import { CustomerModule } from '../customers/customer.module';
import { ProductModule } from 'src/procurement/product/product.module';

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
