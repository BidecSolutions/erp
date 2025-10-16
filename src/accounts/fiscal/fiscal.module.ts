import { Module } from '@nestjs/common';
import { FiscalController } from './fiscal.controller';
import { FiscalService } from './fiscal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { accountsFiscalYear } from '../entity/fiscal-year.entity';

@Module({
  controllers: [FiscalController],
  providers: [FiscalService],
  imports: [TypeOrmModule.forFeature([accountsFiscalYear])]
})
export class FiscalModule { }
