import { Module } from '@nestjs/common';
import { SalesOrderController } from './sales-order.controller';
import { SalesOrderService } from './sales-order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesOrder } from './entity/sales-order.entity';
import { SalesOrderDetail } from './entity/sales-order-detail.entity';
import { Company } from 'src/Company/companies/company.entity';
import { Branch } from 'src/Company/branch/branch.entity';
import { Customer } from 'src/Company/customers/customer.entity';
import { Product } from 'src/procurement/product/entities/product.entity';
import { productVariant } from 'src/procurement/product/entities/variant.entity';
import { Stock } from 'src/procurement/stock/entities/stock.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    SalesOrder,
    SalesOrderDetail,
    Company,
    Branch,
    Customer,
     Product,
     productVariant,
     Stock
  ])],
  controllers: [SalesOrderController],
  providers: [SalesOrderService]
})
export class SalesOrderModule { }
