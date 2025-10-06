import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
// import { Product } from '../product/entities/product.entity';
// import { Warehouse } from '../warehouse/entities/warehouse.entity';
// import { companySetting } from 'src/Company/company-module-file.module';

@Module({
  imports:[TypeOrmModule.forFeature([Stock])],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
