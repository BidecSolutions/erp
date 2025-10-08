import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Company } from 'src/Company/companies/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category,Company])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
