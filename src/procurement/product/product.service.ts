import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { errorResponse, generateCode, getActiveList, successResponse, toggleStatusResponse } from 'src/commonHelper/response.util';
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
  async store(
    createDto: CreateProductDto,
    imagePath: string[],
    companyId: number,
    userId: number,
  ) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const productRepo = manager.getRepository(Product);
        const variantRepo = manager.getRepository(productVariant);
        const productCode = await generateCode('product', 'PRO', this.dataSource);

        const product = productRepo.create({
          ...createDto,
          images: imagePath,
          company_id: companyId,
          product_code: productCode,
          created_by: userId,
        });

        const savedProduct = await productRepo.save(product);
        let savedVariants: productVariant[] = [];

        if (createDto.variants && createDto.variants.length > 0) {
          const variantsToSave: productVariant[] = [];

          for (const variant of createDto.variants) {
            const variantCode = await generateCode('variant', 'VAR', this.dataSource);
            variantsToSave.push(
              variantRepo.create({
                ...variant,
                product: savedProduct,
                variant_code: variantCode,
              }),
            );
          }

          await variantRepo.save(variantsToSave);
          savedVariants = await variantRepo.find({
            where: { product: { id: savedProduct.id } },
          });
        }

        const productWithVariants = await productRepo.findOne({
          where: { id: savedProduct.id },
          relations: ['variants'], select: {
            id: true,
            category_id: true,
            brand_id: true,
            uom_id: true,
            company_id: true,
            description: true,
            product_name: true,
            product_code: true,
            product_type: true,
            has_variant: true,
            warranty_type: true,
            status: true,
            images: true,
            is_instant_product: true,
            created_by: true,
            variants: {
              id: true,
              variant_code: true,
              variant_name: true,
              unit_price: true,
              cost_price: true,
              barcode: true
            }
          }
        });

        return successResponse('product created successfully!', {
          savedProduct: productWithVariants,
        });
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Product already exists');
      }
      throw new BadRequestException(error.message || 'Failed to create product');
    }
  }

  async findAll(companyId: number) {
    try {
      const [product, total] = await this.productRepo.findAndCount({
        where: { company_id: companyId },
        relations: ['variants'], select: {
          id: true,
          category_id: true,
          brand_id: true,
          uom_id: true,
          company_id: true,
          description: true,
          product_name: true,
          product_code: true,
          product_type: true,
          has_variant: true,
          warranty_type: true,
          status: true,
          images: true,
          is_instant_product: true,
          created_by: true,
          variants: {
            id: true,
            variant_code: true,
            variant_name: true,
            unit_price: true,
            cost_price: true,
            barcode: true
          }
        }
      });

      return successResponse('product retrieved successfully!', {
        total_record: total,
        product,
      });
    } catch (error) {
      return errorResponse('Failed to retrieve product', error.message);
    }
  }
  async findOne(id: number, companyId: number) {
    try {
      const product = await this.productRepo.findOne({
        where: { id },
        relations: ['variants'], select: {
          id: true,
          category_id: true,
          brand_id: true,
          uom_id: true,
          company_id: true,
          description: true,
          product_name: true,
          product_code: true,
          product_type: true,
          has_variant: true,
          warranty_type: true,
          status: true,
          images: true,
          is_instant_product: true,
          created_by: true,
          variants: {
            id: true,
            variant_code: true,
            variant_name: true,
            unit_price: true,
            cost_price: true,
            barcode: true
          }
        },
      });
      if (!product) {
        return errorResponse(`product not found`);
      }
      return successResponse('product retrieved successfully!', product);
    } catch (error) {
      return errorResponse('Failed to retrieve product', error.message);
    }
  }
  async update(
    id: number,
    updateDto: CreateProductDto,
    imagePath: string[],
    companyId: number,
    userId: number,
  ) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const productRepo = manager.getRepository(Product);
        const variantRepo = manager.getRepository(productVariant);
        const existingProduct = await productRepo.findOne({
          where: { id, company_id: companyId },
          relations: ['variants'],
        });

        if (!existingProduct) {
          throw new NotFoundException(`Product #${id} not found`);
        }
        productRepo.merge(existingProduct, {
          ...updateDto,
          images: imagePath?.length ? imagePath : existingProduct.images,
          company_id: companyId,
          updated_by: userId,
        });
        const updatedProduct = await productRepo.save(existingProduct);
        const existingVariants = await variantRepo.find({
          where: { product_id: id },
        });
        const updatedVariants: productVariant[] = [];

        if (updateDto.variants && updateDto.variants.length > 0) {
          const incomingKeys = updateDto.variants.map(
            (v) =>
              `${v.variant_name}-${v.attribute_id || ''}-${v.attribute_value || ''}`,
          );
          for (const variant of updateDto.variants) {
            const key = `${variant.variant_name}-${variant.attribute_id || ''}-${variant.attribute_value || ''}`;
            const existingVariant = existingVariants.find(
              (v) =>
                `${v.variant_name}-${v.attribute_id || ''}-${v.attribute_value || ''}` === key,
            );
            if (existingVariant) {
              variantRepo.merge(existingVariant, {
                ...variant,
              });
              updatedVariants.push(await variantRepo.save(existingVariant));
            } else {
              // Create new variant
              const variantCode = await generateCode('variant', 'VAR', this.dataSource);
              const newVariant = variantRepo.create({
                ...variant,
                variant_code: variantCode,
                product: updatedProduct,
              });
              updatedVariants.push(await variantRepo.save(newVariant));
            }
          }
        } else {
          throw new BadRequestException('At least one variant is required');
        }
        return successResponse('Product updated successfully!', {
          product: updatedProduct,
          variants: updatedVariants,
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

  findInstantProduct() {
    return this.productRepo.find({ where: { is_instant_product: 1 } });
  }
}
