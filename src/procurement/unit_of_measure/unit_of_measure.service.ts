import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUnitOfMeasureDto } from './dto/create-unit_of_measure.dto';
import { UpdateUnitOfMeasureDto } from './dto/update-unit_of_measure.dto';
import { errorResponse, successResponse, toggleStatusResponse } from 'src/commonHelper/response.util';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnitOfMeasure } from './entities/unit_of_measure.entity';

@Injectable()
export class UnitOfMeasureService {

    constructor(
        @InjectRepository(UnitOfMeasure)
      private readonly repo: Repository<UnitOfMeasure>) {}

async create(createDto: CreateUnitOfMeasureDto) {
      try {
        const unit_of_measure = this.repo.create(createDto);
        await this.repo.save(unit_of_measure);
        return successResponse('unit_of_measure created successfully!', unit_of_measure);
        
      } catch (error) {
          if (error.code === 'ER_DUP_ENTRY') {
          throw new BadRequestException('unit of measure already exists');
        }
        throw new BadRequestException(error.message || 'Failed to create unit_of_measure');
      }
    }
 async findAll(filter?: number) {
      try {
        const where: any = {};
        if (filter !== undefined) {
          where.status = filter; // filter apply
        }
        const [unit_of_measure, total] = await this.repo.findAndCount({
          where,
        });
        return successResponse('unit of measure retrieved successfully!', {
          total_record: total,
          unit_of_measure,
        });
      } catch (error) {
        return errorResponse('Failed to retrieve unit_of_measure', error.message);
      }
    }

 async findOne(id: number) {
      try {
        const unit_of_measure = await this.repo.findOneBy({ id });
        if (!unit_of_measure) {
          return errorResponse(`unit of measure #${id} not found`);
        }
    
        return successResponse('unit of measure retrieved successfully!', unit_of_measure);
      } catch (error) {
        return errorResponse('Failed to retrieve unit of measure', error.message);
      }
    }

 async update(id: number, updateDto: UpdateUnitOfMeasureDto) {
      try {
        const existing = await this.repo.findOne({ where: { id } });
        if (!existing) {
          return errorResponse(`unit of measure #${id} not found`);
        }
    
        const unit_of_measure = await this.repo.save({ id, ...updateDto });
        return successResponse('unit of measure updated successfully!', unit_of_measure);
      } catch (error) {
        return errorResponse('Failed to update brand', error.message);
      }
    }
  async statusUpdate(id: number) {
   try {
     const unit_of_measure = await this.repo.findOne({ where: { id } });
     if (!unit_of_measure) throw new NotFoundException('brand not found');
 
     unit_of_measure.status = unit_of_measure.status === 0 ? 1 : 0;
     const saved = await this.repo.save(unit_of_measure);
 
     return toggleStatusResponse('unit of measure', saved.status);
   } catch (err) {
     return errorResponse('Something went wrong', err.message);
   }
     }
}
