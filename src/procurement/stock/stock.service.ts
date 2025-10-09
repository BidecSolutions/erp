import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateStockDto } from './dto/update-stock.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { IsNull, Repository ,DataSource } from 'typeorm';
import { errorResponse, successResponse, toggleStatusResponse } from 'src/commonHelper/response.util';
import { CreateStockDto } from './dto/create-stock.dto';
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
  ) {}
// async store(dto: CreateStockDto ,companyId :number) {
//   try { 
//     return await this.dataSource.transaction(async (manager) => {
//       const stockRepo = manager.getRepository(Stock);
//       const stocksToSave: Stock[] = [];
//       for (const product of dto.products) {
//         let stock = await stockRepo.findOne({
//           where: {
//             product_id: product.product_id,
//             warehouse_id: dto.warehouse_id,
//             company_id: companyId,
//             branch_id: dto.branch_id,
//             variant_id: product.variant_id ?? IsNull(),
//           },
//         });
//         console.log("stock" ,stock)
//         if (stock) {
//           stock.quantity_on_hand += product.quantity_on_hand;
//           stock.alert_qty = product.alert_qty ?? stock.alert_qty;
//         } else {
//             const productData = await this.productRepo.findOne({
//               where: { id: product.product_id },
//               select: ['has_variant'],
//             });

//             if (!productData) {
//               throw new BadRequestException(`Product with ID ${product.product_id} not found`);
//             }

//             // ✅ If product has variants, then variant_id is required
//             if (productData.has_variant) {
//               if (!product.variant_id) {
//                 throw new BadRequestException(
//                   `variant_id is required for product ${product.product_id} because it has variants`
//                 );
//               }
//             }

//             // ✅ Otherwise (has_variant = false), variant_id can be null
//             const stock = stockRepo.create({
//               product_id: product.product_id,
//               variant_id: productData.has_variant ? product.variant_id : null,
//               quantity_on_hand: product.quantity_on_hand,
//               alert_qty: product.alert_qty ?? 0,
//               warehouse_id: dto.warehouse_id,
//               company_id: companyId,
//               branch_id: dto.branch_id,
//             });

//         stocksToSave.push(stock);

//       }
//     }
//       const savedStocks = await stockRepo.save(stocksToSave);
//       return successResponse('Stock craeted successfully!', savedStocks);
//     });
//   } catch (error) {
//     throw new BadRequestException(error.message || 'Failed to save stock');
//   }
// }
async store(dto: CreateStockDto, companyId: number) {
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
            variant_id: product.variant_id ?? IsNull(),
          },
        });

        if (stock) {
          // ✅ Existing stock → update quantity
          stock.quantity_on_hand += product.quantity_on_hand;
          stock.alert_qty = product.alert_qty ?? stock.alert_qty;
          await stockRepo.save(stock); // <-- ✅ You missed this line
          continue; // skip to next product
        }

        // ✅ New stock entry
        const productData = await this.productRepo.findOne({
          where: { id: product.product_id },
          select: ['has_variant'],
        });

        if (!productData) {
          throw new BadRequestException(`Product with ID ${product.product_id} not found`);
        }

        if (productData.has_variant && !product.variant_id) {
          throw new BadRequestException(
            `variant_id is required for product ${product.product_id} because it has variants`
          );
        }

        const newStock = stockRepo.create({
          product_id: product.product_id,
          variant_id: productData.has_variant ? product.variant_id : null,
          quantity_on_hand: product.quantity_on_hand,
          alert_qty: product.alert_qty ?? 0,
          warehouse_id: dto.warehouse_id,
          company_id: companyId,
          branch_id: dto.branch_id,
        });

        stocksToSave.push(newStock);
      }

      // ✅ Save all newly created stock records (if any)
      if (stocksToSave.length > 0) {
        await stockRepo.save(stocksToSave);
      }

      return successResponse('Stock saved successfully!');
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
