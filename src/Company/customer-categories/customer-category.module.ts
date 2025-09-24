import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerCategory } from './customer-category.entity';
import { Company } from '../companies/company.entity';
import { CustomerCategoryService } from './customer-category.service';
import { CustomerCategoryController } from './customer-category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerCategory, Company])],
  controllers: [CustomerCategoryController],
  providers: [CustomerCategoryService],
})
export class CustomerCategoryModule {}
