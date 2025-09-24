import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { Warehouse } from './entities/warehouse.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { errorResponse, successResponse, toggleStatusResponse } from 'src/commonHelper/response.util';

@Injectable()
export class WarehouseService {
  constructor(
      @InjectRepository(Warehouse)
    private readonly warehouseRepo: Repository<Warehouse>) {}
    
  async create(createDto: CreateWarehouseDto) {
      try {
        const warehouse = this.warehouseRepo.create(createDto);
        await this.warehouseRepo.save(warehouse);
        return successResponse('warehouse created successfully!', warehouse);
        
      } catch (error) {
          if (error.code === 'ER_DUP_ENTRY') {
          throw new BadRequestException('warehouse already exists');
        }
        throw new BadRequestException(error.message || 'Failed to create warehouse');
      }
    }
  async findAll(filter?: number) {
      try {
        const where: any = {};
        if (filter !== undefined) {
          where.status = filter; // filter apply
        }
        const [warehouse, total] = await this.warehouseRepo.findAndCount({
          where,
        });
        return successResponse('warehouse retrieved successfully!', {
          total_record: total,
          warehouse,
        });
      } catch (error) {
        return errorResponse('Failed to retrieve warehouse', error.message);
      }
    }
  async findOne(id: number) {
      try {
        const warehouse = await this.warehouseRepo.findOneBy({ id });
        if (!warehouse) {
          return errorResponse(`warehouse #${id} not found`);
        }
    
        return successResponse('warehouse retrieved successfully!', warehouse);
      } catch (error) {
        return errorResponse('Failed to retrieve warehouse', error.message);
      }
    }
  async update(id: number, updateDto: UpdateWarehouseDto) {
      try {
        const existing = await this.warehouseRepo.findOne({ where: { id } });
        if (!existing) {
          return errorResponse(`warehouse #${id} not found`);
        }
    
        const warehouse = await this.warehouseRepo.save({ id, ...updateDto });
        return successResponse('warehouse updated successfully!', warehouse);
      } catch (error) {
        return errorResponse('Failed to update warehouse', error.message);
      }
    }
  async statusUpdate(id: number) {
  try {
    const warehouse = await this.warehouseRepo.findOne({ where: { id } });
    if (!warehouse) throw new NotFoundException('warehouse not found');

    warehouse.status = warehouse.status === 0 ? 1 : 0;
    const saved = await this.warehouseRepo.save(warehouse);

    return toggleStatusResponse('warehouse', saved.status);
  } catch (err) {
    return errorResponse('Something went wrong', err.message);
  }
    }
}
