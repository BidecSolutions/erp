import { Module } from '@nestjs/common';
import { StockMovementService } from './stock_movement.service';
import { StockMovementController } from './stock_movement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockMovement } from './entities/stock_movement.entity';
import { Warehouse } from '../warehouse/entities/warehouse.entity';
import { productVariant } from '../product/entities/variant.entity';
import { Product } from '../product/entities/product.entity';
import { Company } from 'src/Company/companies/company.entity';
import { Branch } from 'src/Company/branch/branch.entity';
import { Stock } from '../stock/entities/stock.entity';

@Module({
  imports:[TypeOrmModule.forFeature([StockMovement ,Stock, Warehouse ,Product, Company ,Branch ])],
  controllers: [StockMovementController],
  providers: [StockMovementService],
})
export class StockMovementModule {}
