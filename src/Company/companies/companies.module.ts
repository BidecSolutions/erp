import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { Company } from './company.entity';
import { userCompanyMapping } from 'src/entities/user-company-mapping.entity';
import { User } from 'src/entities/user.entity';
import { userRoleMapping } from 'src/entities/user-role-mapping.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, userCompanyMapping, User, userRoleMapping])],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule { }
