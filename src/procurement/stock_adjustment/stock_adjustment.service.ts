import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStockAdjustmentDto } from './dto/create-stock_adjustment.dto';
import { UpdateStockAdjustmentDto } from './dto/update-stock_adjustment.dto';
import { CreateStockMovementDto } from '../stock_movement/dto/create-stock_movement.dto';
import { StockAdjustment } from './entities/stock_adjustment.entity';
import { StockMovement } from '../stock_movement/entities/stock_movement.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { errorResponse, successResponse, toggleStatusResponse } from 'src/commonHelper/response.util';
import { Stock } from '../stock/entities/stock.entity';
import { AdjustmentType } from '../enums/stock-adjustments.enum';
import { MovementType } from '../enums/stock-movement.enum';

@Injectable()
export class StockAdjustmentService {
  constructor(
    @InjectRepository(StockAdjustment)
    private readonly stockAdjustmentRepo: Repository<StockAdjustment>,
    @InjectRepository(Stock)
    private readonly stockRepo: Repository<Stock>,
    @InjectRepository(StockMovement)
    private readonly stockMovementRepo: Repository<StockMovement>,
    private readonly dataSource: DataSource,

  ) { }
  async store(createDto: CreateStockAdjustmentDto) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        // Stock Adjustment
        const adjustment = manager.create(StockAdjustment, {
          product: { id: createDto.product_id },
          warehouse: { id: createDto.warehouse_id },
          quantity: createDto.quantity,
          adjustment_type: createDto.adjustment_type,
          reason: createDto.reason,
          company_id: createDto.company_id,
          branch_id: createDto.branch_id,
        });
        const stockAdjustment = await manager.save(adjustment);

        // Stock
        // const stock = await manager.findOne(Stock, {
        //   where: {
        //     product: { id: createDto.product_id },
        //     warehouse: { id: createDto.warehouse_id },
        //   },
        // });

        // if (!stock) {
        //   throw new NotFoundException('Stock record not found for this product & warehouse');
        // }

        // if (createDto.adjustment_type === AdjustmentType.INCREASE) {
        //   stock.quantity_on_hand += createDto.quantity;
        // } else if (createDto.adjustment_type === AdjustmentType.DECREASE) {
        //   if (stock.quantity_on_hand < createDto.quantity) {
        //     throw new BadRequestException('Insufficient stock for adjustment');
        //   }
        //   stock.quantity_on_hand -= createDto.quantity;
        // }

        // const updatedStock = await manager.save(stock);

        // // Stock Movement
        // const movement = manager.create(StockMovement, {
        //   product: { id: createDto.product_id },
        //   fromWarehouse: { id: createDto.warehouse_id },
        //   toWarehouse: { id: createDto.warehouse_id },
        //   quantity: createDto.quantity,
        //   movement_type: MovementType.ADJUSTMENT,
        //   reference_type: 'STOCK_ADJUSTMENT',
        //   reference_number: `ADJ-${stockAdjustment.id}`,
        // });
        // const stockMovement = await manager.save(movement);

        return successResponse('Stock adjustment created successfully!', {
          stockAdjustment,
          // updatedStock,
          // stockMovement,
        });
      });

      // return await this.dataSource.transaction(async (manager) => {
      //   // 1. Create Stock Adjustment entry
      //   const adjustment = this.stockAdjustmentRepo.create({
      //     product: { id: createDto.product_id },
      //     warehouse: { id: createDto.warehouse_id },
      //     quantity: createDto.quantity,
      //     adjustment_type: createDto.adjustment_type,
      //     reason: createDto.reason,
      //     company_id: createDto.company_id,
      //     branch_id: createDto.branch_id,
      //   });

      //   const stockAdjustment = await manager.save(adjustment);

      //   // 2. Find existing stock
      //   const stock = await this.stockRepo.findOne({
      //     where: {
      //       product: { id: createDto.product_id },
      //       warehouse: { id: createDto.warehouse_id },
      //     },
      //   });

      //   if (!stock) {
      //     throw new NotFoundException(
      //       'Stock record not found for this product & warehouse',
      //     );
      //   }

      //   // 3. Update stock qty according to adjustment type
      //   if (createDto.adjustment_type === AdjustmentType.INCREASE) {
      //     stock.quantity_on_hand += createDto.quantity;
      //   } else if (createDto.adjustment_type === AdjustmentType.DECREASE) {
      //     if (stock.quantity_on_hand < createDto.quantity) {
      //       throw new BadRequestException('Insufficient stock for adjustment');
      //     }
      //     stock.quantity_on_hand -= createDto.quantity;
      //   }

      //   const updatedStock = await manager.save(stock);

      //   // 4. Add Stock Movement entry
      //   const movement = this.stockMovementRepo.create({
      //     product: { id: createDto.product_id },
      //     fromWarehouse: { id: createDto.warehouse_id }, // adjustment always in same warehouse
      //     toWarehouse: { id: createDto.warehouse_id },
      //     quantity: createDto.quantity,
      //     movement_type: MovementType.ADJUSTMENT,
      //     reference_type: 'STOCK_ADJUSTMENT', //enums
      //     reference_number: `ADJ-${stockAdjustment.id}`,
      //   });

      //   const stockMovement = await manager.save(movement);

      //   return successResponse('Stock adjustment created successfully!', {
      //     stockAdjustment,
      //     updatedStock,
      //     stockMovement,
      //   });
      // });
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to create stock adjustment',
      );
    }
  }
  // async store(createDto: CreateStockAdjustmentDto) {
  //   try {
  //     // 1. Create Stock Adjustment entry
  //     const adjustment = this.stockAdjustmentRepo.create({
  //       product: { id: createDto.product_id },
  //       warehouse: { id: createDto.warehouse_id },
  //       quantity: createDto.quantity,
  //       adjustment_type: createDto.adjustment_type,
  //       reason: createDto.reason,
  //       company_id:createDto.company_id,
  //       branch_id :createDto.branch_id
  //     });

  //     const stockAdjustment = await this.stockAdjustmentRepo.save(adjustment);
  //     const stock = await this.stockRepo.findOne({
  //       where: {
  //         product: { id: createDto.product_id },
  //         warehouse: { id: createDto.warehouse_id },
  //       },
  //     });

  //     if (!stock) {
  //       throw new NotFoundException('Stock record not found for this product & warehouse');
  //     }

  //     // Update stock qty according to adjustment type
  //     if (createDto.adjustment_type === AdjustmentType.INCREASE) {
  //       stock.quantity_on_hand += createDto.quantity;
  //     } else if (createDto.adjustment_type === AdjustmentType.DECREASE) {
  //       stock.quantity_on_hand -= createDto.quantity;
  //     }

  //     const updatedstock = await this.stockRepo.save(stock);

  //     // Add Stock Movement entry
  //     const movement = this.stockMovementRepo.create({
  //       product: { id: createDto.product_id },
  //       fromWarehouse: { id: createDto.warehouse_id },   // adjustment hamesha same warehouse par hoti hai
  //       toWarehouse: { id: createDto.warehouse_id },
  //       quantity: createDto.quantity,
  //       movement_type: MovementType.ADJUSTMENT,
  //       reference_type: 'STOCK_ADJUSTMENT',
  //       reference_number: `ADJ-${stockAdjustment.id}`,
  //     });

  //     const stockMovement = await this.stockMovementRepo.save(movement);
  //     return successResponse('Stock adjustment created successfully!', {
  //       stockAdjustment,
  //       updatedstock,
  //       stockMovement,
  //     });

  //   } catch (error) {
  //     // if (error.code === 'ER_DUP_ENTRY') {
  //     //   throw new BadRequestException('Stock adjustment already exists');
  //     // }
  //     // throw new BadRequestException(error.message || 'Failed to create stock adjustment');
  //   }
  // }


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
  // async update(id: number, updateDto: UpdateStockAdjustmentDto) {
  //   try {
  //     const existing = await this.stockAdjustmentRepo.findOne({ where: { id } });
  //     if (!existing) {
  //       return errorResponse(`stockAdjustment #${id} not found`);
  //     }

  //     const stockAdjustment = await this.stockAdjustmentRepo.save({ id, ...updateDto });
  //     return successResponse('stockAdjustment updated successfully!', stockAdjustment);
  //   } catch (error) {
  //     return errorResponse('Failed to update stockAdjustment', error.message);
  //   }
  // }
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
