import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeValue } from './Entity/attribute_value.entity';
import { AttributeValueController } from './attribute.controller';
import { AttributeValueService } from './attribute_value.service';



@Module({
  imports:[TypeOrmModule.forFeature([AttributeValue])],
  controllers: [AttributeValueController],
  providers: [AttributeValueService],
})
export class AttributeValueModule {}
