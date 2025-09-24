import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './supplier.entity';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { Company } from '../companies/company.entity';
import { SupplierCategory } from '../supplier-category/supplier-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier, Company, SupplierCategory])],
  providers: [SupplierService],
  controllers: [SupplierController],
})
export class SupplierModule {}
