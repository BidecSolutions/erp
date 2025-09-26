import { Controller, Post, Body } from '@nestjs/common';
import { SupplierInvoiceService } from './supplier-invoice.service';
import { CreateSupplierInvoiceDto } from './dto/create-supplier-invoice.dto';

@Controller('supplier-invoices')
export class SupplierInvoiceController {
  constructor(private readonly invoiceService: SupplierInvoiceService) {}

  @Post('create')
  create(@Body() dto: CreateSupplierInvoiceDto) {
    return this.invoiceService.create(dto);
  }
}
