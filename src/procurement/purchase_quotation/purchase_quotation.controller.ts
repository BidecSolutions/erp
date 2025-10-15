import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { CreatePurchaseQuotationDto } from './dto/create-purchase_quotation.dto';
import { UpdatePurchaseQuatiationDto } from './dto/update-purchase_quotation.dto';
import { PurchaseQuotationService } from './purchase_quotation.service';
import { JwtEmployeeAuth } from 'src/auth/jwt-employee.guard';
@UseGuards(JwtEmployeeAuth)
@Controller('purchase-quotation')
export class PurchaseQuatiationController {
  constructor(private readonly PurchaseQuotationService: PurchaseQuotationService) { }

  @Post('store')
  store(@Body() createdto: CreatePurchaseQuotationDto,
    @Req() req: Request) {
    const userData = req["user"];
    const userId = userData?.user?.id;
    const companyId = userData?.company_id;

    return this.PurchaseQuotationService.store(createdto, userId, companyId);
  }
  @Get('list')
  findAll(@Query('filter') filter?: string) {
    return this.PurchaseQuotationService.findAll(
      filter !== undefined ? Number(filter) : undefined,
    );
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.PurchaseQuotationService.findOne(+id);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePurchaseQuatiationDto: UpdatePurchaseQuatiationDto) {
    return this.PurchaseQuotationService.update(+id, updatePurchaseQuatiationDto);
  }
  @Get('toogleStatus/:id')
  statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.PurchaseQuotationService.statusUpdate(id);
  }
  @Post('approve')
  async approveSupplier(
    @Body('id') id: number,
    @Body('supplier_id') supplier_id: number,
  ) {
    return this.PurchaseQuotationService.approveSupplier(id, supplier_id);
  }

}
