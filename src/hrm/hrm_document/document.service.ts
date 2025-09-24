import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private readonly docRepo: Repository<Document>,
  ) {}

  async createMany(
    employeeId: number,
    files: { [key: string]: Express.Multer.File[] },
  ) {
    const docs: Document[] = [];

    for (const [fieldName, uploadedFiles] of Object.entries(files)) {
      for (const file of uploadedFiles) {
        const doc = this.docRepo.create({
          employeeId,
          type: fieldName, // e.g., cv, photo, cnic
          filePath: file.filename, // saved filename
        });
        docs.push(doc);
      }
    }

    if (docs.length > 0) {
      return this.docRepo.save(docs);
    }
    return [];
  }

  async findByEmployee(employeeId: number) {
    return this.docRepo.find({ where: { employeeId } });
  }


  
}
