import { Controller, Post, Body } from '@nestjs/common';
import { SupplierPaymentService } from './supplier-payment.service';
import { CreateSupplierPaymentDto } from './dto/create-supplier-payment.dto';

@Controller('supplier-payments')
export class SupplierPaymentController {
  constructor(private readonly paymentService: SupplierPaymentService) {}

  @Post('create')
  create(@Body() dto: CreateSupplierPaymentDto) {
    return this.paymentService.create(dto);
  }
}
