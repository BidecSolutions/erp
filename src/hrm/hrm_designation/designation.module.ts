import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Designation } from './designation.entity';
import { DesignationService } from './designation.service';
import { DesignationController } from './designation.controller';
import { Department } from '../hrm_department/department.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Designation, Department])],
  providers: [DesignationService],
  controllers: [DesignationController],
  exports: [DesignationService]
})
export class DesignationModule { }
