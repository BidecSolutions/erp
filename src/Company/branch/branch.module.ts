import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { Branch } from '../branch/branch.entity';
import { Company } from '../companies/company.entity';
import { userCompanyMapping } from 'src/entities/user-company-mapping.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Branch, Company, userCompanyMapping])],
  controllers: [BranchController],
  providers: [BranchService],
})
export class BranchModule { }
// 