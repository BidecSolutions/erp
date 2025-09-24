import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierCategory } from './supplier-category.entity';
import { SupplierCategoryService } from './supplier-category.service';
import { SupplierCategoryController } from './supplier-category.controller';
import { Company } from '../companies/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SupplierCategory, Company])],
  controllers: [SupplierCategoryController],
  providers: [SupplierCategoryService],
})
export class SupplierCategoryModule {}
