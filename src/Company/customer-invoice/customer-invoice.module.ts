import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerInvoiceService } from './customer-invoice.service';
import { CustomerInvoiceController } from './customer-invoice.controller';
import { CustomerInvoice } from './entity/customer-invoice.entity';
import { Company } from '../companies/company.entity';
import { Customer } from '../customers/customer.entity';
import { SalesOrder } from 'src/sales/sales-order/entity/sales-order.entity';
import { customer_invoice_items } from './entity/customer-invoice-items.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerInvoice, Company, Customer, SalesOrder,customer_invoice_items]),
  ],
  controllers: [CustomerInvoiceController],
  providers: [CustomerInvoiceService],
  exports: [CustomerInvoiceService],
})
export class CustomerInvoiceModule {}
