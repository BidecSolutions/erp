import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { Product } from '../product/entities/product.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Stock ,Product])],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
