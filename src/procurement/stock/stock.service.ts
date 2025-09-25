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
  

}
