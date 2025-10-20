import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CustomerInvoiceService } from './customer-invoice.service';
import { CreateCustomerInvoiceDto } from './dto/create-customer-invoice.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
// @UseGuards(JwtAuthGuard)
@Controller('customer-invoices')
export class CustomerInvoiceController {
  constructor(private readonly invoiceService: CustomerInvoiceService) {}

  @Post('create')
  create(@Body() dto: CreateCustomerInvoiceDto) {
    return this.invoiceService.createInvoice(dto);
  }
}
