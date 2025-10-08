import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { PurchaseOrderService } from './purchase_order.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase_order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase_order.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtEmployeeAuth } from 'src/auth/jwt-employee.guard';

@UseGuards(JwtEmployeeAuth)
@Controller('purchase-order')
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) { }

  @Post('store')
  store(@Body() createDto: CreatePurchaseOrderDto,
   @Req() req: Request) {
      const userData = req["user"];
      const userId = userData?.user?.id;
      const companyId = userData?.company_id;
      console.log("data" ,userId, companyId)
    return this.purchaseOrderService.store(createDto ,userId, companyId);
  }
  @Get('list')
  findAll(@Query('filter') filter?: string) {
    return this.purchaseOrderService.findAll(
      filter !== undefined ? Number(filter) : undefined,
    );
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseOrderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBrandDto: UpdatePurchaseOrderDto) {
    return this.purchaseOrderService.update(+id, updateBrandDto);
  }
  @Get('toogleStatus/:id')
  statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.purchaseOrderService.statusUpdate(id);
  }
  @Post('approve')
  async approve(
    @Param('id') id: number,
  ) {
    return this.purchaseOrderService.approveOrder(id);
  }

}
