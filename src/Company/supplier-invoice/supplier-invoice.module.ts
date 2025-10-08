import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierInvoiceService } from './supplier-invoice.service';
import { SupplierInvoiceController } from './supplier-invoice.controller';
import { Company } from '../companies/company.entity';
import { Supplier } from '../supplier/supplier.entity';
import { SupplierInvoice } from './entities/supplier-invoice.entity';
import { SupplierInvoiceItem } from './entities/supplier-invoice-item';
import { PurchaseOrder } from 'src/procurement/purchase_order/entities/purchase_order.entity';
import { PurchaseGrn } from 'src/procurement/goods_receiving_note/entities/goods_receiving_note.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SupplierInvoice, PurchaseOrder, SupplierInvoiceItem, Company, Supplier ,PurchaseOrder,PurchaseGrn])],
  controllers: [SupplierInvoiceController],
  providers: [SupplierInvoiceService],
  exports: [SupplierInvoiceService],
})
export class SupplierInvoiceModule {}
