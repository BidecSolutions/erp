import { Controller, Post, Body, Query, Param, Get, Patch, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { SupplierInvoiceService } from './supplier-invoice.service';
import { CreateSupplierInvoiceDto } from './dto/create-supplier-invoice.dto';
import { UpdateSupplierInvoiceDto } from './dto/update-supplier-invoice.dto';
import { JwtEmployeeAuth } from 'src/auth/jwt-employee.guard';
@UseGuards(JwtEmployeeAuth)
@Controller('supplier-invoices')
export class SupplierInvoiceController {
  constructor(private readonly invoiceService: SupplierInvoiceService) { }

  @Post('store')
  store(@Body() dto: CreateSupplierInvoiceDto
    , @Req() req: Request) {
    const userData = req["user"];
    const userId = userData?.user?.id;
    const companyId = userData?.company_id;
    return this.invoiceService.store(dto, userId, companyId);
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
