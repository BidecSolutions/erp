import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './supplier.entity';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { Company } from '../companies/company.entity';
import { SupplierCategory } from '../supplier-category/supplier-category.entity';
import { SupplierAccount } from './supplier.supplier_account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier, Company, SupplierCategory, SupplierAccount])],
  providers: [SupplierService],
  controllers: [SupplierController],
})
export class SupplierModule {}
