import { Module } from '@nestjs/common';
import { StockAdjustmentService } from './stock_adjustment.service';
import { StockAdjustmentController } from './stock_adjustment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockAdjustment } from './entities/stock_adjustment.entity';
import { Stock } from '../stock/entities/stock.entity';
import { StockMovement } from '../stock_movement/entities/stock_movement.entity';

@Module({
  imports:[TypeOrmModule.forFeature([StockAdjustment , StockMovement ,Stock])],
  controllers: [StockAdjustmentController],
  providers: [StockAdjustmentService],
})
export class StockAdjustmentModule {}
