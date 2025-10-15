import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './department.entity';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { Company } from 'src/Company/companies/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Department, Company])],
  providers: [DepartmentService],
  controllers: [DepartmentController],
  exports: [DepartmentService]
})
export class DepartmentModule { }
