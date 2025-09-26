import { Controller, Post, Body } from '@nestjs/common';
import { CustomerInvoiceService } from './customer-invoice.service';
import { CreateCustomerInvoiceDto } from './dto/create-customer-invoice.dto';

@Controller('customer-invoices')
export class CustomerInvoiceController {
  constructor(private readonly invoiceService: CustomerInvoiceService) {}

  @Post('create')
  create(@Body() dto: CreateCustomerInvoiceDto) {
    return this.invoiceService.create(dto);
  }
}
