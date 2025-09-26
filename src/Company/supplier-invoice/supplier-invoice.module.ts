import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierInvoiceService } from './supplier-invoice.service';
import { SupplierInvoiceController } from './supplier-invoice.controller';
import { SupplierInvoice } from './supplier-invoice.entity';
import { Company } from '../companies/company.entity';
import { Supplier } from '../supplier/supplier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SupplierInvoice, Company, Supplier])],
  controllers: [SupplierInvoiceController],
  providers: [SupplierInvoiceService],
  exports: [SupplierInvoiceService],
})
export class SupplierInvoiceModule {}
