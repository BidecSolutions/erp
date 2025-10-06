import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateModuleTypeDto } from './dto/create-module_type.dto';
import { UpdateModuleTypeDto } from './dto/update-module_type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ModuleType } from './entities/module_type.entity';
import { Repository } from 'typeorm';
import { errorResponse, successResponse, toggleStatusResponse } from 'src/commonHelper/response.util';

@Injectable()
export class ModuleTypeService {
  constructor(
    @InjectRepository(ModuleType)
    private readonly repo: Repository<ModuleType>) { }

  async create(createDto: CreateModuleTypeDto) {
    try {
      const module_type = this.repo.create(createDto);
      await this.repo.save(module_type);
      return successResponse('module type created successfully!', module_type);

    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('module type already exists');
      }
      throw new BadRequestException(error.message || 'Failed to create module_type');
    }
  }
  async findAll(filter?: number) {
    try {
      const where: any = {};
      if (filter !== undefined) {
        where.status = filter; // filter apply
      }
      const [module_type, total] = await this.repo.findAndCount({
        where,
      });
      return successResponse('module type retrieved successfully!', {
        total_record: total,
        module_type,
      });
    } catch (error) {
      return errorResponse('Failed to retrieve module type', error.message);
    }
  }
  async findOne(id: number) {
    try {
      const module_type = await this.repo.findOneBy({ id });
      if (!module_type) {
        return errorResponse(`module_type #${id} not found`);
      }

      return successResponse('module type retrieved successfully!', module_type);
    } catch (error) {
      return errorResponse('Failed to retrieve module_type', error.message);
    }
  }
  async update(id: number, updateDto: UpdateModuleTypeDto) {
    try {
      const existing = await this.repo.findOne({ where: { id } });
      if (!existing) {
        return errorResponse(`module type #${id} not found`);
      }

      const module_type = await this.repo.save({ id, ...updateDto });
      return successResponse('module type updated successfully!', module_type);
    } catch (error) {
      return errorResponse('Failed to update module type', error.message);
    }
  }
  async statusUpdate(id: number) {
    try {
      const module_type = await this.repo.findOne({ where: { id } });
      if (!module_type) throw new NotFoundException('module type not found');

      module_type.status = module_type.status === 0 ? 1 : 0;
      const saved = await this.repo.save(module_type);

      return toggleStatusResponse('module type', saved.status);
    } catch (err) {
      return errorResponse('Something went wrong', err.message);
    }
  }
}
