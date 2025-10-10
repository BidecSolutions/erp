import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository, DataSource } from 'typeorm';
import { errorResponse, generateCode, successResponse, toggleStatusResponse } from 'src/commonHelper/response.util';
import { combineAll } from 'rxjs';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
    private readonly dataSource: DataSource,

  ) { }
  async create(createDto: CreateCategoryDto, companyId: number, userId: number) {
    try {
      const categoryCode = await generateCode('category', 'CAT', this.dataSource);

      const category = this.repo.create({
        ...createDto,
        category_code: categoryCode,
        company_id: companyId,
        created_by: userId
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
  async findAll(companyId: number) {
    try {
      const [category, total] = await this.repo.findAndCount({
        where: { company_id: companyId },
        order: { id: 'DESC' },
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
  async update(id: number, updateDto: UpdateCategoryDto, companyId: number, userId: number) {
    try {
      const existing = await this.repo.findOne({ where: { id } });
      if (!existing) {
        return errorResponse(`category #${id} not found`);
      }

      const category = await this.repo.save({
        id,
        ...updateDto,
        updated_by: userId,
        company_id: companyId


      });
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
