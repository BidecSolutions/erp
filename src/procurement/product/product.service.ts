import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
import { Warranty } from '../warranty/entities/warranty.entity';
import { ModuleType } from '../module_type/entities/module_type.entity';

@Injectable()
export class ProductService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,
    @InjectRepository(UnitOfMeasure)
    private readonly uomRepo: Repository<UnitOfMeasure>,
    @InjectRepository(Warranty)
    private readonly warrantyRepo: Repository<Warranty>,
    @InjectRepository(ModuleType)
    private readonly moduleTypeRepo: Repository<ModuleType>,
  ) { }
  async create() {
    try {
      const categories = await getActiveList(this.categoryRepo, 'category_name');
      const brands = await getActiveList(this.brandRepo, 'brand_name');
      const uoms = await getActiveList(this.uomRepo, 'uom_name');
      const warranties = await getActiveList(this.warrantyRepo, 'warranty_type');
      const module_types = await getActiveList(this.moduleTypeRepo, 'module_type');
      return successResponse('data fetched successfully', {
        categories,
        brands,
        uoms,
        warranties,
        module_types
      });
    } catch (error) {
      return errorResponse('Failed to load masters', error.message);
    }
  }
  async store(createDto: CreateProductDto, imagePath: string[]) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        // Save product
        const product = manager.getRepository(Product).create({
          ...createDto,
          images: imagePath,
        }
        );
        const savedProduct = await manager.getRepository(Product).save(product);
        
        let savedVariant: productVariant[] = [];
        // Save variant
        if (createDto.variants && createDto.variants.length > 0) {
          const variantsData = createDto.variants.map((variant) =>
            manager.getRepository(productVariant).create({
              ...variant,
              product: savedProduct,
            }),
          );
          await manager.getRepository(productVariant).save(variantsData);

          savedVariant = await manager.getRepository(productVariant).find({
            where: { product: { id: savedProduct.id } },
          });
        }
        return successResponse('product created successfully!', {
          savedProduct,
          variantData: savedVariant,

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
        relations: ['variants'],
      });
      if (total == 0) {
        return successResponse('No record found!')
      }
      return successResponse('product retrieved rrsuccessfully!', {
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
        return successResponse(`product not found`);
      }
      return successResponse('product retrieved successfully!', product);
    } catch (error) {
      return errorResponse('Failed to retrieve product', error.message);
    }
  }
async update(id: number, updateDto: CreateProductDto, imagePath: string[]) {
  try {
    return await this.dataSource.transaction(async (manager) => {
      const productRepo = manager.getRepository(Product);
      const variantRepo = manager.getRepository(productVariant);

      const existingProduct = await productRepo.findOne({
        where: { id },
        relations: ['variants'],
      });
      if (!existingProduct) {
        throw new NotFoundException(`Product #${id} not found`);
      }
      productRepo.merge(existingProduct, {
        ...updateDto,
        images: imagePath?.length ? imagePath : existingProduct.images,
      });
      const updatedProduct = await productRepo.save(existingProduct);

      let updatedVariants: productVariant[] = [];
      if (updateDto.variants && updateDto.variants.length > 0) {
        const incomingCodes = updateDto.variants.map((v) => v.variant_code);
        // update existing OR insert new
        for (const variant of updateDto.variants) {
          const existingVariant = await variantRepo.findOne({
            where: { variant_code: variant.variant_code, product: { id: updatedProduct.id } },
          });
          if (existingVariant) {
            variantRepo.merge(existingVariant, variant);
            updatedVariants.push(await variantRepo.save(existingVariant));
          } else {
            const newVariant = variantRepo.create({
              ...variant,
              product: updatedProduct,
            });
            updatedVariants.push(await variantRepo.save(newVariant));
          }
        }
      }
      return successResponse('Product updated successfully!', {
        updatedProduct,
      });
    });
  } catch (error) {
    throw new BadRequestException(error.message || 'Failed to update product');
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
