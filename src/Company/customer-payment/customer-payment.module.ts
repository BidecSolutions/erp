import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerPayment } from './customer-payment.entity';
import { CustomerPaymentService } from './customer-payment.service';
import { CustomerPaymentController } from './customer-payment.controller';
import { Company } from '../companies/company.entity';
import { Customer } from '../customers/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerPayment, Company, Customer])],
  providers: [CustomerPaymentService],
  controllers: [CustomerPaymentController],
})
export class CustomerPaymentModule {}
