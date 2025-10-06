import { Controller, Post, Body, Query, Param, Get, Patch, ParseIntPipe } from '@nestjs/common';
import { SupplierInvoiceService } from './supplier-invoice.service';
import { CreateSupplierInvoiceDto } from './dto/create-supplier-invoice.dto';
import { UpdateSupplierInvoiceDto } from './dto/update-supplier-invoice.dto';

@Controller('supplier-invoices')
export class SupplierInvoiceController {
  constructor(private readonly invoiceService: SupplierInvoiceService) { }

  @Post('store')
  store(@Body() dto: CreateSupplierInvoiceDto) {
    return this.invoiceService.store(dto);
  }
  @Get('list')
  findAll(@Query('filter') filter?: string) {
    return this.invoiceService.findAll(
      filter !== undefined ? Number(filter) : undefined,
    );
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoiceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateSupplierInvoiceDto) {
    return this.invoiceService.update(+id, updateDto);
  }
  @Get('toogleStatus/:id')
  statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.invoiceService.statusUpdate(id);
  }
}
