import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateStockDto } from './dto/update-stock.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { errorResponse, successResponse, toggleStatusResponse } from 'src/commonHelper/response.util';
import { CreateStockDto } from './dto/create-stock.dto';
import { Stock } from './entities/stock.entity';

@Injectable()
export class StockService {
  constructor(
      @InjectRepository(Stock)
    private readonly stockRepo: Repository<Stock>) {}
    
  async create(createDto: CreateStockDto)  {
      try {
        const stock = this.stockRepo.create(createDto);
        await this.stockRepo.save(stock);
        return successResponse('stock created successfully!', stock);
        
      } catch (error) {
          if (error.code === 'ER_DUP_ENTRY') {
          throw new BadRequestException('stock already exists');
        }
        throw new BadRequestException(error.message || 'Failed to create stock');
      }
    }
  async findAll(filter?: number) {
      try {
        const where: any = {};
        if (filter !== undefined) {
          where.status = filter; // filter apply
        }
        const [stock, total] = await this.stockRepo.findAndCount({
          where,
        });
        return successResponse('stock retrieved successfully!', {
          total_record: total,
          stock,
        });
      } catch (error) {
        return errorResponse('Failed to retrieve stock', error.message);
      }
    }
      async findOne(id: number) {
          try {
            const stock = await this.stockRepo.findOneBy({ id });
            if (!stock) {
              return errorResponse(`stock #${id} not found`);
            }
        
            return successResponse('stock retrieved successfully!', stock);
          } catch (error) {
            return errorResponse('Failed to retrieve stock', error.message);
          }
        }
      async update(id: number, updateDto: UpdateStockDto) {
          try {
            const existing = await this.stockRepo.findOne({ where: { id } });
            if (!existing) {
              return errorResponse(`stock #${id} not found`);
            }
        
            const stock = await this.stockRepo.save({ id, ...updateDto });
            return successResponse('stock updated successfully!', stock);
          } catch (error) {
            return errorResponse('Failed to update stock', error.message);
          }
        }
      async statusUpdate(id: number) {
      try {
        const stock = await this.stockRepo.findOne({ where: { id } });
        if (!stock) throw new NotFoundException('stock not found');
    
        stock.status = stock.status === 0 ? 1 : 0;
        const saved = await this.stockRepo.save(stock);
    
        return toggleStatusResponse('stock', saved.status);
      } catch (err) {
        return errorResponse('Something went wrong', err.message);
      }
        }
  

}
