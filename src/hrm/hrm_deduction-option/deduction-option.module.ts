import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeductionOptionService } from './deduction-option.service';
import { DeductionOptionController } from './deduction-option.controller';
import { DeductionOption } from './deduction-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeductionOption])],
  controllers: [DeductionOptionController],
  providers: [DeductionOptionService],
  exports: [DeductionOptionService],
})
export class DeductionOptionModule {}
