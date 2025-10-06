import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWarrantyDto } from './dto/create-warranty.dto';
import { UpdateWarrantyDto } from './dto/update-warranty.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Warranty } from './entities/warranty.entity';
import { Repository } from 'typeorm';
import { errorResponse, successResponse, toggleStatusResponse } from 'src/commonHelper/response.util';

@Injectable()
export class WarrantyService {
constructor(
      @InjectRepository(Warranty)
    private readonly repo: Repository<Warranty>) {}
    
  async store(createDto: CreateWarrantyDto) {
      try {
        const warranty = this.repo.create(createDto);
        await this.repo.save(warranty);
        return successResponse('warranty created successfully!', warranty);
        
      } catch (error) {
      
        throw new BadRequestException(error.message || 'Failed to create warranty');
      }
    }
  async findAll(filter?: number) {
      try {
        const where: any = {};
        if (filter !== undefined) {
          where.status = filter; // filter apply
        }
        const [warranty, total] = await this.repo.findAndCount({
          where,
        });
        return successResponse('warranty retrieved successfully!', {
          total_record: total,
          warranty,
        });
      } catch (error) {
        return errorResponse('Failed to retrieve warranty', error.message);
      }
    }
  async findOne(id: number) {
      try {
        const warranty = await this.repo.findOneBy({ id });
        if (!warranty) {
          return errorResponse(`warranty #${id} not found`);
        }
    
        return successResponse('warranty retrieved successfully!', warranty);
      } catch (error) {
        return errorResponse('Failed to retrieve warranty', error.message);
      }
    }
  async update(id: number, updateDto: UpdateWarrantyDto) {
      try {
        const existing = await this.repo.findOne({ where: { id } });
        if (!existing) {
          return errorResponse(`warranty #${id} not found`);
        }
    
        const warranty = await this.repo.save({ id, ...updateDto });
        return successResponse('warranty updated successfully!', warranty);
      } catch (error) {
        return errorResponse('Failed to update warranty', error.message);
      }
    }
  async statusUpdate(id: number) {
  try {
    const warranty = await this.repo.findOne({ where: { id } });
    if (!warranty) throw new NotFoundException('warranty not found');

    warranty.status = warranty.status === 0 ? 1 : 0;
    const saved = await this.repo.save(warranty);

    return toggleStatusResponse('warranty', saved.status);
  } catch (err) {
    return errorResponse('Something went wrong', err.message);
  }
    }
}
