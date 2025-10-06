import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierInvoiceService } from './supplier-invoice.service';
import { SupplierInvoiceController } from './supplier-invoice.controller';
import { Company } from '../companies/company.entity';
import { Supplier } from '../supplier/supplier.entity';
import { SupplierInvoice } from './entities/supplier-invoice.entity';
import { SupplierInvoiceItem } from './entities/supplier-invoice-item';
import { PurchaseOrder } from 'src/procurement/purchase_order/entities/purchase_order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SupplierInvoice, PurchaseOrder, SupplierInvoiceItem, Company, Supplier])],
  controllers: [SupplierInvoiceController],
  providers: [SupplierInvoiceService],
  exports: [SupplierInvoiceService],
})
export class SupplierInvoiceModule {}
