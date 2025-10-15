import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shift } from './shift.entity';
import { ShiftService } from './shift.service';
import { ShiftController } from './shift.controller';
import { EmpRoaster } from './emp-roaster.entity';
import { EmployeeModule } from '../hrm_employee/employee.module';

@Module({
imports: [
    TypeOrmModule.forFeature([Shift, EmpRoaster]),
    EmployeeModule, // ✅ ADD FOR ShiftService injection
  ],
  providers: [ShiftService],
  controllers: [ShiftController],
  exports: [ShiftService],
})
export class ShiftModule {}
