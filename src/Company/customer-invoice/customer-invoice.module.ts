import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerInvoiceService } from './customer-invoice.service';
import { CustomerInvoiceController } from './customer-invoice.controller';
import { CustomerInvoice } from './customer-invoice.entity';
import { Company } from '../companies/company.entity';
import { Customer } from '../customers/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerInvoice, Company, Customer]),
  ],
  controllers: [CustomerInvoiceController],
  providers: [CustomerInvoiceService],
  exports: [CustomerInvoiceService],
})
export class CustomerInvoiceModule {}
