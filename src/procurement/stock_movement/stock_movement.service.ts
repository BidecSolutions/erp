import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { errorResponse, successResponse, toggleStatusResponse } from 'src/commonHelper/response.util';
import { StockMovement } from './entities/stock_movement.entity';
import { CreateStockMovementDto } from './dto/create-stock_movement.dto';
import { UpdateStockMovementDto } from './dto/update-stock_movement.dto';
import { Stock } from '../stock/entities/stock.entity';

@Injectable()
export class StockMovementService {
  constructor(
      @InjectRepository(StockMovement)
    private readonly stockMovementRepo: Repository<StockMovement>,
    @InjectRepository(Stock)
    private readonly stockRepo: Repository<Stock>
  
  
  ) {}
  
  
    
  async store(createDto: CreateStockMovementDto) {
      try {
        const stockMovement = this.stockMovementRepo.create(createDto);
        const stock_movement = await this.stockMovementRepo.save(stockMovement);

      const stock = await this.stockRepo.findOne({
          where: { product_id: stock_movement.product_id },
        });

        if (!stock) {
          throw new NotFoundException(`Stock not found for product ${stock_movement.product_id }`);
        }
        const quantity_on_hand = stock.quantity_on_hand - stock_movement.quantity;
       const stockData = await this.stockRepo.update(
          { product_id: stock_movement.product_id  },
          { quantity_on_hand },
        );

        return successResponse('stock Movement created successfully!',{
          stockData,
          stockMovement
        } );
        
      } catch (error) {
          if (error.code === 'ER_DUP_ENTRY') {
          throw new BadRequestException('stockMovement already exists');
        }
        throw new BadRequestException(error.message || 'Failed to create stockMovement');
      }
    }
  async findAll(filter?: number) {
      try {
        const where: any = {};
        if (filter !== undefined) {
          where.status = filter; // filter apply
        }
        const [stockMovement, total] = await this.stockMovementRepo.findAndCount({
          where,
        });
        return successResponse('stockMovement retrieved successfully!', {
          total_record: total,
          stockMovement,
        });
      } catch (error) {
        return errorResponse('Failed to retrieve stockMovement', error.message);
      }
    }
  async findOne(id: number) {
      try {
        const stockMovement = await this.stockMovementRepo.findOneBy({ id });
        if (!stockMovement) {
          return errorResponse(`stockMovement #${id} not found`);
        }
    
        return successResponse('stockMovement retrieved successfully!', stockMovement);
      } catch (error) {
        return errorResponse('Failed to retrieve stockMovement', error.message);
      }
    }
  async update(id: number, updateDto: UpdateStockMovementDto) {
      try {
        const existing = await this.stockMovementRepo.findOne({ where: { id } });
        if (!existing) {
          return errorResponse(`stockMovement #${id} not found`);
        }
    
        const stockMovement = await this.stockMovementRepo.save({ id, ...updateDto });
        return successResponse('stockMovement updated successfully!', stockMovement);
      } catch (error) {
        return errorResponse('Failed to update stockMovement', error.message);
      }
    }
  async statusUpdate(id: number) {
  try {
    const stockMovement = await this.stockMovementRepo.findOne({ where: { id } });
    if (!stockMovement) throw new NotFoundException('stockMovement not found');

    stockMovement.status = stockMovement.status === 0 ? 1 : 0;
    const saved = await this.stockMovementRepo.save(stockMovement);

    return toggleStatusResponse('stockMovement', saved.status);
  } catch (err) {
    return errorResponse('Something went wrong', err.message);
  }
    }
}
