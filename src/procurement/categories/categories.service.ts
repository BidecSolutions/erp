import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository, DataSource } from 'typeorm';
import { errorResponse, generateCode, successResponse, toggleStatusResponse } from 'src/commonHelper/response.util';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
  ) { }
  async create(createDto: CreateCategoryDto, companyId: number) {
    try {
      const category = this.repo.create({
        ...createDto,
        company: { id: companyId },
      });

      await this.repo.save(category);
      return successResponse('category created successfully!', category);

    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('category already exists');
      }
      throw new BadRequestException(error.message || 'Failed to create category');
    }
  }
  async findAll(companyID: number, filter?: number) {
    try {
      const where: any = {};
      if (filter !== undefined) {
        where.status = filter; // 👈 match your column name
      }
      const [category, total] = await this.repo.findAndCount({
        where,
        order: { created_date: 'DESC' }, // optional: sort latest first
      });

      return successResponse('category retrieved successfully!', {
        total_records: total,
        category,
      });
    } catch (error) {
      return errorResponse('Failed to retrieve category', error.message);
    }
  }

  async findOne(id: number) {
    try {
      const category = await this.repo.findOneBy({ id });
      if (!category) {
        return errorResponse(`category #${id} not found`);
      }

      return successResponse('category retrieved successfully!', category);
    } catch (error) {
      return errorResponse('Failed to retrieve category', error.message);
    }
  }
  async update(id: number, updateDto: UpdateCategoryDto) {
    try {
      const existing = await this.repo.findOne({ where: { id } });
      if (!existing) {
        return errorResponse(`category #${id} not found`);
      }

      const category = await this.repo.save({ id, ...updateDto });
      return successResponse('category updated successfully!', category);
    } catch (error) {
      return errorResponse('Failed to update category', error.message);
    }
  }
  async statusUpdate(id: number) {
    try {
      const category = await this.repo.findOne({ where: { id } });
      if (!category) throw new NotFoundException('category not found');

      category.status = category.status === 0 ? 1 : 0;
      const saved = await this.repo.save(category);

      return toggleStatusResponse('category', saved.status);
    }
    catch (err) {
      return errorResponse('Something went wrong', err.message);
    }
  }
}
