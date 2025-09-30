import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStockAdjustmentDto } from './dto/create-stock_adjustment.dto';
import { UpdateStockAdjustmentDto } from './dto/update-stock_adjustment.dto';
import { CreateStockMovementDto } from '../stock_movement/dto/create-stock_movement.dto';
import { StockAdjustment } from './entities/stock_adjustment.entity';
import { StockMovement } from '../stock_movement/entities/stock_movement.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { errorResponse, successResponse, toggleStatusResponse } from 'src/commonHelper/response.util';
import { Stock } from '../stock/entities/stock.entity';
import { AdjustmentType } from '../enums/stock-adjustments.enum';
import { MovementType } from '../enums/stock-movement.enum';

@Injectable()
export class StockAdjustmentService {
  constructor(
    @InjectRepository(StockAdjustment)
    private readonly stockAdjustmentRepo: Repository<StockMovement>,
    @InjectRepository(Stock)
    private readonly stockRepo: Repository<Stock>,
    @InjectRepository(StockMovement)
    private readonly stockMovementRepo: Repository<StockMovement>,

  ) { }


  async store(createDto: CreateStockAdjustmentDto) {
    // 1. Adjustment save karo
    const adjustment = this.stockAdjustmentRepo.create(createDto);
    await this.stockAdjustmentRepo.save(adjustment);

    // 2. Inventory find karo
    const inventory = await this.stockRepo.findOne({
      where: {
        product: { id: createDto.product_id },
        warehouse: { id: createDto.warehouse_id },
      },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory record not found');
    }

    // 3. Quantity calculation
    if (createDto.adjustment_type === AdjustmentType.INCREASE) {
      inventory.quantity_on_hand += createDto.quantity;
    } else {
      inventory.quantity_on_hand -= createDto.quantity;
    }

    await this.stockRepo.save(inventory);

    // 4. Stock movement add karo
    // const stockMovement = this.stockMovementRepo.create({
    //   product: { id: createDto.product_id },
    //   fromWarehouse: null,
    //   toWarehouse: { id: createDto.warehouse_id },
    //   quantity: createDto.quantity,
    //   movement_type:MovementType.ADJUSTMENT,
    //   reference_type: 'STOCK_ADJUSTMENT',
    //   reference_number: `ADJ-${adjustment.id}`,
    //   balance_after: inventory.quantity_on_hand,
    // });

    // await this.stockMovementRepo.save(stockMovement);

      return successResponse('stockAdjustment retrieved successfully!', {
        adjustment,
        inventory,
        
      });
  }

  async findAll(filter?: number) {
    try {
      const where: any = {};
      if (filter !== undefined) {
        where.status = filter; // filter apply
      }
      const [stockAdjustment, total] = await this.stockAdjustmentRepo.findAndCount({
        where,
      });
      return successResponse('stockAdjustment retrieved successfully!', {
        total_record: total,
        stockAdjustment,
      });
    } catch (error) {
      return errorResponse('Failed to retrieve stockAdjustment', error.message);
    }
  }
  async findOne(id: number) {
    try {
      const stockAdjustment = await this.stockAdjustmentRepo.findOneBy({ id });
      if (!stockAdjustment) {
        return errorResponse(`stockAdjustment #${id} not found`);
      }

      return successResponse('stockAdjustment retrieved successfully!', stockAdjustment);
    } catch (error) {
      return errorResponse('Failed to retrieve stockAdjustment', error.message);
    }
  }
  async update(id: number, updateDto: UpdateStockAdjustmentDto) {
    try {
      const existing = await this.stockAdjustmentRepo.findOne({ where: { id } });
      if (!existing) {
        return errorResponse(`stockAdjustment #${id} not found`);
      }

      const stockAdjustment = await this.stockAdjustmentRepo.save({ id, ...updateDto });
      return successResponse('stockAdjustment updated successfully!', stockAdjustment);
    } catch (error) {
      return errorResponse('Failed to update stockAdjustment', error.message);
    }
  }
  async statusUpdate(id: number) {
    try {
      const stockAdjustment = await this.stockAdjustmentRepo.findOne({ where: { id } });
      if (!stockAdjustment) throw new NotFoundException('stockAdjustment not found');

      stockAdjustment.status = stockAdjustment.status === 0 ? 1 : 0;
      const saved = await this.stockAdjustmentRepo.save(stockAdjustment);

      return toggleStatusResponse('stockAdjustment', saved.status);
    } catch (err) {
      return errorResponse('Something went wrong', err.message);
    }
  }
}
