import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Holiday } from './holiday.entity';
import { HolidayService } from './holiday.service';
import { HolidayController } from './holiday.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Holiday])],
  controllers: [HolidayController],
  providers: [HolidayService],
  exports: [HolidayService], // 👈 export for AttendanceService use
})
export class HolidayModule {}
