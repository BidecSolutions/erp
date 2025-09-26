import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { Company } from '../companies/company.entity';
import { CustomerCategory } from '../customer-categories/customer-category.entity';
import { CustomerAccount } from './customer.customer_account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Company, CustomerCategory,CustomerAccount])],
  providers: [CustomerService],
  controllers: [CustomerController],
})
export class CustomerModule { }
  