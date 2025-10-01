import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateStockDto } from './dto/update-stock.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { IsNull, Repository ,DataSource } from 'typeorm';
import { errorResponse, successResponse, toggleStatusResponse } from 'src/commonHelper/response.util';
import { CreateStockDto } from './dto/create-stock.dto';
import { Stock } from './entities/stock.entity';

@Injectable()
export class StockService {
  constructor(
      @InjectRepository(Stock)
    private readonly stockRepo: Repository<Stock>,
    private readonly dataSource: DataSource,
  ) {}
    
async store(dto: CreateStockDto) {
  try {
    return await this.dataSource.transaction(async (manager) => {
      const stockRepo = manager.getRepository(Stock);

      const stocksToSave: Stock[] = [];

      for (const product of dto.products) {
        let stock = await stockRepo.findOne({
          where: {
            product_id: product.product_id,
            warehouse_id: dto.warehouse_id,
            company_id: dto.company_id,
            branch_id: dto.branch_id,
            // variant_id null ho to IsNull() use karna
            variant_id: product.variant_id ?? IsNull(),
          },
        });

        if (stock) {
          // ✅ update existing stock
          stock.quantity_on_hand += product.quantity_on_hand;
          stock.reorder_level = product.reorder_level ?? stock.reorder_level;
          stock.reorder_quantity = product.reorder_quantity ?? stock.reorder_quantity;
        } else {
          // ✅ create new stock
          stock = stockRepo.create({
            product_id: product.product_id,
            variant_id: product.variant_id ?? null,
            quantity_on_hand: product.quantity_on_hand,
            reorder_level: product.reorder_level ?? 0,
            reorder_quantity: product.reorder_quantity ?? 0,
            warehouse_id: dto.warehouse_id,
            company_id: dto.company_id,
            branch_id: dto.branch_id,

          });
        }

        stocksToSave.push(stock);
      }

      // ✅ Save all stocks in one go
      const savedStocks = await stockRepo.save(stocksToSave);

      return successResponse('Stock craeted successfully!', savedStocks);
    });
  } catch (error) {
    throw new BadRequestException(error.message || 'Failed to save stock');
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
