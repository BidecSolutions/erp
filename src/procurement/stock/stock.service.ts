import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { IsNull, Repository, DataSource } from 'typeorm';
import { errorResponse, successResponse, toggleStatusResponse } from 'src/commonHelper/response.util';
import { CreateStockDto, UpdateStockDto } from './dto/create-stock.dto';
import { Stock } from './entities/stock.entity';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepo: Repository<Stock>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly dataSource: DataSource,
  ) { }
  async store(dto: CreateStockDto, companyId: number, userId: number) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const stockRepo = manager.getRepository(Stock);
        const stocksToSave: Stock[] = [];

        for (const product of dto.products) {
          let stock = await stockRepo.findOne({
            where: {
              product_id: product.product_id,
              warehouse_id: dto.warehouse_id,
              company_id: companyId,
              branch_id: dto.branch_id,
              variant_id: product.variant_id,
            },
          });

          if (stock) {
            stock.quantity_on_hand += product.quantity_on_hand;
            stock.alert_qty = product.alert_qty ?? stock.alert_qty;
            await stockRepo.save(stock);
            continue;
          }
          // const productData = await this.productRepo.findOne({
          //   where: { id: product.product_id },
          //   select: ['has_variant'],
          // });

          // if (!productData) {
          //   throw new BadRequestException(`Product with ID ${product.product_id} not found`);
          // }

          // if (productData.has_variant && !product.variant_id) {
          //   throw new BadRequestException(
          //     `variant_id is required for product ${product.product_id} because it has variants`
          //   );
          // }

          const newStock = stockRepo.create({
            product_id: product.product_id,
            variant_id: product.variant_id,
            quantity_on_hand: product.quantity_on_hand,
            alert_qty: product.alert_qty ?? 0,
            warehouse_id: dto.warehouse_id,
            company_id: companyId,
            branch_id: dto.branch_id,
            created_by:userId
          });
          stocksToSave.push(newStock);
        }
        if (stocksToSave.length > 0) {
            await stockRepo.save(stocksToSave);
        }
        return successResponse('Stock created successfully!',stocksToSave );
      });
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to save stock');
    }
  }

  async findAll(companyId: number) {
    const [stock, total] = await this.stockRepo.findAndCount({
      where: { company_id: companyId },
      order: { id: 'DESC' },
    });
    return successResponse('stock retrieved successfully!', {
      total_record: total,
      stock,
    });
  } catch(error) {
    return errorResponse('Failed to retrieve stock', error.message);
  }


  async findOne(id: number, companyId: number) {
    try {
      const stock = await this.stockRepo.findOne({
        where: { id, company_id: companyId }
      });
      if (!stock) {
        return errorResponse(`stock #${id} not found`);
      }
      return successResponse('stock retrieved successfully!', stock);
    } catch (error) {
      return errorResponse('Failed to retrieve stock', error.message);
    }
  }
  async update(id: number, updateDto: UpdateStockDto,companyId: number, userId: number) {
    try {
      const existing = await this.stockRepo.findOne({
           where: { id, company_id: companyId },
      })
    
      if (!existing) {
        return errorResponse(`stock #${id} not found`);
      }

      const stock = await this.stockRepo.save(
        { id,
           ...updateDto ,
           company_id :companyId,
           updated_by:userId
          });
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
