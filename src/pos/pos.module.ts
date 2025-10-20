import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PosService } from './pos.service';
import { PosController } from './pos.controller';
import { StockAdjustment } from 'src/procurement/stock_adjustment/entities/stock_adjustment.entity';
import { SalesOrder } from 'src/sales/sales-order/entity/sales-order.entity';
import { SalesOrderDetail } from 'src/sales/sales-order/entity/sales-order-detail.entity';

import { ProductModule } from 'src/procurement/product/product.module';
import { CustomerModule } from 'src/Company/customers/customer.module';
import { Company } from 'src/Company/companies/company.entity';
import { Customer } from 'src/Company/customers/customer.entity';
import { Product } from 'src/procurement/product/entities/product.entity';
import { CustomerAccount } from 'src/Company/customers/customer.customer_account.entity';
import { Stock } from 'src/procurement/stock/entities/stock.entity';
import { Branch } from 'src/Company/branch/branch.entity';
import { productVariant } from 'src/procurement/product/entities/variant.entity';
import { SalesReturnDetail } from './entities/sales-return-detail.entity';
import { SalesReturn } from './entities/sales-return.entity';
import { Category } from 'src/procurement/categories/entities/category.entity';
import { HoldOrder } from './entities/hold-order.entity';
import { HoldOrderDetail } from './entities/hold-order-detail.entity';
import { CashRegisterSession } from './entities/cash-register-session.entity';

@Module({
  imports: [ProductModule,
    CustomerModule,
    TypeOrmModule.forFeature([
      StockAdjustment,
      SalesOrder,
      SalesOrderDetail,
      Company,
      Customer,
      Product,CustomerAccount,Stock,Branch,productVariant,SalesReturnDetail,SalesReturn,
      Category,HoldOrderDetail,HoldOrder,CashRegisterSession,
    ]),
  ],
  providers: [PosService],
  controllers: [PosController],
})
export class PosModule { }
