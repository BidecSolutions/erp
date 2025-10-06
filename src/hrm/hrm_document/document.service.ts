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

  /**
   * Create or update multiple documents for an employee
   */
  async createOrUpdateMany(
    employeeId: number,
    files: { [key: string]: Express.Multer.File[] },
    
  ) {
    const docsToSave: Document[] = [];

    for (const [fieldName, uploadedFiles] of Object.entries(files)) {
      // Validation
      for (const file of uploadedFiles) {
        if (fieldName === 'cv' || fieldName === 'academic_transcript') {
          if (
            ![
              'application/pdf',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ].includes(file.mimetype)
          ) {
            throw new BadRequestException(
              `${fieldName.toUpperCase()} must be PDF or DOCX`,
            );
          }
        }

        if (fieldName === 'photo' || fieldName === 'identity_card') {
          if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
            throw new BadRequestException(
              `${fieldName.replace('_', ' ')} must be PNG, JPG, or JPEG`,
            );
          }
          if (file.size > 2 * 1024 * 1024) {
            throw new BadRequestException(
              `${fieldName.replace('_', ' ')} must not exceed 2 MB`,
            );
          }
        }

        if (fieldName === 'identity_card' && uploadedFiles.length !== 2) {
          throw new BadRequestException(
            'Identity Card must have exactly 2 files (front & back)',
          );
        }
      }

      if (fieldName === 'identity_card') {
        // Fetch existing identity_card documents
        const existingDocs = await this.docRepo.find({
          where: { employeeId, type: 'identity_card' },
          order: { id: 'ASC' },
        });

        // Update existing docs or create new if not enough
        for (let i = 0; i < uploadedFiles.length; i++) {
          const file = uploadedFiles[i];
          let doc: Document;

          if (existingDocs[i]) {
            // Update existing
            doc = existingDocs[i];
            doc.filePath = file.filename;
          } else {
            // Create new if fewer existing docs
            doc = this.docRepo.create({
              employeeId,
              type: 'identity_card',
              filePath: file.filename,
              status: 1,
            });
          }
          docsToSave.push(doc);
        }
      } else {
        // Single file documents (cv, photo, academic_transcript)
        let doc = await this.docRepo.findOne({
          where: { employeeId, type: fieldName },
        });

        if (doc) {
          doc.filePath = uploadedFiles[0].filename; // update existing
        } else {
          doc = this.docRepo.create({
            employeeId,
            type: fieldName,
            filePath: uploadedFiles[0].filename,
            status: 1,
          });
        }
        docsToSave.push(doc);
      }
    }

    if (docsToSave.length > 0) {
      return this.docRepo.save(docsToSave);
    }

    return [];
  }

  /**
   * Find all documents for an employee
   */
  async findByEmployee(employeeId: number) {
    return this.docRepo.find({ where: { employeeId } });
  }

  /**
   * Update status of multiple documents
   */
  async updateStatusForMany(documents: Document[], status: number) {
    if (!documents || documents.length === 0) return;

    for (const doc of documents) {
      doc.status = status;
    }

    await this.docRepo.save(documents);
  }
}
