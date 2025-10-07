import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { Company } from './company.entity';
import { userCompanyMapping } from 'src/entities/user-company-mapping.entity';
import { User } from 'src/entities/user.entity';
import { userRoleMapping } from 'src/entities/user-role-mapping.entity';
import { Customer } from '../customers/customer.entity';
import { CustomerCategory } from '../customer-categories/customer-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer,CustomerCategory ,Company, userCompanyMapping, User, userRoleMapping])],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule { }
