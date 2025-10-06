import { Module } from '@nestjs/common';
import { ModuleTypeService } from './module_type.service';
import { ModuleTypeController } from './module_type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleType } from './entities/module_type.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ModuleType])],
  controllers: [ModuleTypeController],
  providers: [ModuleTypeService],
})
export class ModuleTypeModule {}
