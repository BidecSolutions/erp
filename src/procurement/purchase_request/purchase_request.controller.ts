import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseGuards, Req } from '@nestjs/common';
import { PurchaseRequestService } from './purchase_request.service';
import { CreatePurchaseRequestDto } from './dto/create-purchase_request.dto';
import { UpdatePurchaseRequestDto } from './dto/update-purchase_request.dto';
import { JwtEmployeeAuth } from 'src/auth/jwt-employee.guard';

@UseGuards(JwtEmployeeAuth)
@Controller('purchase-request')
export class PurchaseRequestController {
  constructor(private readonly purchaseRequestService: PurchaseRequestService) { }

  @Get('create')
  fetch() {
    return this.purchaseRequestService.create();
  }
  @Post('store')
  store(@Body() createPurchaseRequestDto: CreatePurchaseRequestDto, @Req() req: Request) {
    const userId = req["user"].user.id;
    const companyId = req["user"].company_id;
    return this.purchaseRequestService.store(createPurchaseRequestDto, userId, companyId);
  }


  @Get('list')
  findAll(@Req() req: Request) {

    const companyId = req["user"].company_id;
    return this.purchaseRequestService.findAll(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string,
    @Req() req: Request) {
    const companyId = req["user"].company_id;
    return this.purchaseRequestService.findOne(+id, companyId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePurchaseRequestDto,
    @Req() req: Request) {
    const companyId = req["user"].company_id;
    const userId = req["user"].user.id;

    return this.purchaseRequestService.update(+id, dto, companyId, userId);
  }

  @Get('toogleStatus/:id')
  statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.purchaseRequestService.statusUpdate(id);
  }


  @Post('approve/:id')
  async approvePurchaseReq(
    @Param('id') id: number,
    @Req() req: Request) {
    const companyId = req["user"].company_id;
    const userId = req["user"].user.id;
    return this.purchaseRequestService.approvePr(id, companyId, userId);

  }

  @Post('approveitr/:id')
  async approveItrReq(
    @Param('id') id: number,
    @Body() body: { approvedItems: any[] },
    @Req() req: Request
  ) {
    const companyId = req["user"].company_id;
    const userId = req["user"].user.id;
    return this.purchaseRequestService.approveItr(
      id,
      companyId,
      userId,
      body.approvedItems 
    );
  }


}
