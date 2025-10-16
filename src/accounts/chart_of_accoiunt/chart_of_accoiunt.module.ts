import { Module } from '@nestjs/common';
import { ChartOfAccoiuntController } from './chart_of_accoiunt.controller';
import { ChartOfAccoiuntService } from './chart_of_accoiunt.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { accountsChartOFAccount } from '../entity/chart-of-account.entity';

@Module({
  controllers: [ChartOfAccoiuntController],
  providers: [ChartOfAccoiuntService],
  imports: [TypeOrmModule.forFeature([accountsChartOFAccount])]
})
export class ChartOfAccoiuntModule { }
