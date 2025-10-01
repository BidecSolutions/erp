import { BadRequestException, Injectable } from '@nestjs/common';
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
      // ✅ CV / Academic Transcript → PDF or DOCX only
      if (fieldName === 'cv' || fieldName === 'academic_transcript') {
        if (
          ![
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          ].includes(file.mimetype)
        ) {
          throw new BadRequestException(
            `${fieldName.toUpperCase()} must be a PDF or DOCX file`,
          );
        }
      }

      // ✅ Photo / Identity Card → PNG, JPG, JPEG only + 2MB size
      if (fieldName === 'photo' || fieldName === 'identity_card') {
        if (
          !['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)
        ) {
          throw new BadRequestException(
            `${fieldName.replace('_', ' ')} must be in PNG, JPG, or JPEG format`,
          );
        }
        if (file.size > 2 * 1024 * 1024) {
          throw new BadRequestException(
            `${fieldName.replace('_', ' ')} must not exceed 2 MB`,
          );
        }
      }

      // ✅ Identity card → max 2 files
      if (fieldName === 'identity_card' && uploadedFiles.length > 2) {
        throw new BadRequestException(
          `Identity Card can only have a maximum of 2 files (front and back)`,
        );
      }

      const doc = this.docRepo.create({
        employeeId,
        type: fieldName,
        filePath: file.filename,
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

async updateStatusForMany(documents: Document[], status: number) {
  if (!documents || documents.length === 0) return;
  
  for (const doc of documents) {
    doc.status = status;
  }

  await this.docRepo.save(documents); // save updated status
}
  
}
