import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './document.entity';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Document])], // 👈 yahan add karo
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService], // 👈 taki dusre modules (EmployeeModule) use kar saken
})
export class DocumentModule {}
