import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeController } from './attribute.controller';

import { Attribute } from './Entity/attribute.entity';
import { AttributeService } from './attribute.service';

@Module({
  imports:[TypeOrmModule.forFeature([Attribute])],
  controllers: [AttributeController],
  providers: [AttributeService],
})
export class AttributeModule {}
