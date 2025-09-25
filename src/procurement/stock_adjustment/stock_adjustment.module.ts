import { Module } from '@nestjs/common';
import { StockAdjustmentService } from './stock_adjustment.service';
import { StockAdjustmentController } from './stock_adjustment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockAdjustment } from './entities/stock_adjustment.entity';

@Module({
  imports:[TypeOrmModule.forFeature([StockAdjustment ,])],
  controllers: [StockAdjustmentController],
  providers: [StockAdjustmentService],
})
export class StockAdjustmentModule {}
