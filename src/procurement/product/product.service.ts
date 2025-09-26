import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { errorResponse, getActiveList, successResponse, toggleStatusResponse } from 'src/commonHelper/response.util';
import { Category } from '../categories/entities/category.entity';
import { Brand } from '../brand/entities/brand.entity';
import { UnitOfMeasure } from '../unit_of_measure/entities/unit_of_measure.entity';
import { productVariant } from './entities/variant.entity';

@Injectable()
export class ProductService {
  constructor(
     private readonly dataSource: DataSource,
    @InjectRepository(Product)
      private readonly productRepo: Repository<Product>,
    @InjectRepository(productVariant)
      private readonly variantRepo: Repository<productVariant>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,
    @InjectRepository(UnitOfMeasure)
    private readonly uomRepo: Repository<UnitOfMeasure>,
    ) {}

    async create() {
  try {
    const categories = await getActiveList(this.categoryRepo, 'category_name');
    const brands = await getActiveList(this.brandRepo, 'brand_name');
    const uoms = await getActiveList(this.uomRepo, 'uom_name');
    return successResponse('data fetched successfully', {
      categories,
      brands,
      uoms,
    });
  } catch (error) {
    return errorResponse('Failed to load masters', error.message);
  }
}

// async store(createProductWithVariantsDto: CreateProductWithVariantsDto) {
//       try {
//         const product = this.productRepo.create(createProductWithVariantsDto);
//         const productData  = await this.productRepo.save(product);

//         return successResponse('product created successfully!', productData);
//       } catch (error) {
//           if (error.code === 'ER_DUP_ENTRY') {
//           throw new BadRequestException('product already exists');
//         }
//         throw new BadRequestException(error.message || 'Failed to create product');
//       }
//     }

async store(createProductDto: CreateProductDto) {
  try{
  return await this.dataSource.transaction(async (manager) => {
    // Save product
    const product = manager.getRepository(Product).create(createProductDto);
    const savedProduct = await manager.getRepository(Product).save(product);
    let variantsData: any[] = []; 
        // Save variant
        if (createProductDto.variants && createProductDto.variants.length > 0) {
          const variantsData = createProductDto.variants.map((variant) =>
            manager.getRepository(productVariant).create({
              ...variant,
              product: savedProduct, // relation ke liye
            }),
          );
          await manager.getRepository(productVariant).save(variantsData);
        }
          return successResponse('product created successfully!',{
            savedProduct,
            variantsData
          });
      });
  } catch (error) {
          if (error.code === 'ER_DUP_ENTRY') {
          throw new BadRequestException('product already exists');
        }
        throw new BadRequestException(error.message || 'Failed to create product');
      }


}


  async findAll(filter?: number) {
      try {
        const where: any = {};
        if (filter !== undefined) {
          where.status = filter; // filter apply
        }
        const [product, total] = await this.productRepo.findAndCount({
          where,
        });
        return successResponse('product retrieved successfully!', {
          total_record: total,
          product,
        });
      } catch (error) {
        return errorResponse('Failed to retrieve product', error.message);
      }
    }

  async findOne(id: number) {
      try {
        const product = await this.productRepo.findOneBy({ id });
        if (!product) {
          return errorResponse(`product #${id} not found`);
        }
    
        return successResponse('product retrieved successfully!', product);
      } catch (error) {
        return errorResponse('Failed to retrieve product', error.message);
      }
     }
     
 async update(id: number, updateDto: UpdateProductDto) {
      try {
        const existing = await this.productRepo.findOne({ where: { id } });
        if (!existing) {
          return errorResponse(`product #${id} not found`);
        }
    
        const product = await this.productRepo.save({ id, ...updateDto });
        return successResponse('product updated successfully!', product);
      } catch (error) {
        return errorResponse('Failed to update product', error.message);
      }
    }

 async statusUpdate(id: number) {
  try {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('product not found');

    product.status = product.status === 0 ? 1 : 0;
    const saved = await this.productRepo.save(product);

    return toggleStatusResponse('product', saved.status);
  } catch (err) {
    return errorResponse('Something went wrong', err.message);
  }
    }
}
