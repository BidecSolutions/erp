import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemConfigurationsService } from './system-configurations.service';
import { SystemConfigurationsController } from './system-configurations.controller';
import { SystemConfiguration } from './system_configuration.entity';
import { Company } from '../companies/company.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([SystemConfiguration, Company]),
    ],
    controllers: [SystemConfigurationsController],
    providers: [SystemConfigurationsService],
    exports: [SystemConfigurationsService],
})
export class SystemConfigurationsModule { }
