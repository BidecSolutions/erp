import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierPaymentService } from './supplier-payment.service';
import { SupplierPaymentController } from './supplier-payment.controller';
import { SupplierPayment } from './supplier-payment.entity';
import { Company } from '../companies/company.entity';
import { Supplier } from '../supplier/supplier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SupplierPayment, Company, Supplier])],
  controllers: [SupplierPaymentController],
  providers: [SupplierPaymentService],
  exports: [SupplierPaymentService],
})
export class SupplierPaymentModule {}
