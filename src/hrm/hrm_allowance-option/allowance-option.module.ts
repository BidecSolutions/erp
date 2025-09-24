import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AllowanceOption } from './allowance-option.entity';
import { AllowanceOptionController } from './allowance-option.controller';
import { AllowanceOptionService } from './allowance-option.service';


@Module({
  imports: [TypeOrmModule.forFeature([AllowanceOption])],
  controllers: [AllowanceOptionController],
  providers: [AllowanceOptionService],
})
export class AllowanceOptionModule {}
