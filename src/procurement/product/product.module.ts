import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { UnitOfMeasure } from '../unit_of_measure/entities/unit_of_measure.entity';
import { Brand } from '../brand/entities/brand.entity';
import { productVariant } from './entities/variant.entity';
import { diskStorage } from 'multer';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import { Warranty } from '../warranty/entities/warranty.entity';
import { ModuleType } from '../module_type/entities/module_type.entity';
@Module({
   imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, callback) => {
          // unique file name generate
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
    TypeOrmModule.forFeature([Product, Category, Brand, UnitOfMeasure, Warranty ,ModuleType,  productVariant])
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule { }
