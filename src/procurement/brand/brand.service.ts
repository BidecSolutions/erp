import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { errorResponse, generateCode, successResponse, toggleStatusResponse } from 'src/commonHelper/response.util';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { } from 'typeorm/browser';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly repo: Repository<Brand>,
    private readonly dataSource: DataSource,

  ) { }

  async create(dto: CreateBrandDto, companyId: number, userId: number) {
    const brandCode = await generateCode('brand', 'BRA', this.dataSource);
    try {
      const brand = this.repo.create({
        ...dto,
        company_id: companyId,
        brand_code: brandCode,
        created_by: userId
      });
      await this.repo.save(brand);
      return successResponse('brand created successfully!', brand);

    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('brand already exists');
      }
      throw new BadRequestException(error.message || 'Failed to create brand');
    }
  }
  async findAll(companyId: number) {
    try {
      const [brand, total] = await this.repo.findAndCount({
        where: { company_id: companyId },
        order: { id: 'DESC' },
      });

      return successResponse('brand retrieved successfully!', {
        total_record: total,
        brand,
      });
    } catch (error) {
      return errorResponse('Failed to retrieve brand', error.message);
    }
  }
  async findOne(id: number, companyId: number) {
    try {
      const brand = await this.repo.findOne({
        where: { id, company_id: companyId }
      }
      );
      if (!brand) {
        return errorResponse(`brand #${id} not found`);
      }

      return successResponse('brand retrieved successfully!', brand);
    } catch (error) {
      return errorResponse('Failed to retrieve brand', error.message);
    }
  }
  async update(id: number, updateDto: UpdateBrandDto, company_id: number, userId: number) {
    try {
      const existing = await this.repo.findOne({
        where: { id, company_id },
      });
      if (!existing) {
        return errorResponse(`brand #${id} not found`);
      }

      const brand = await this.repo.save({
        id,
        ...updateDto,
        company_id: company_id,
        updated_by: userId
      });
      return successResponse('brand updated successfully!', brand);
    } catch (error) {
      return errorResponse('Failed to update brand', error.message);
    }
  }
  async statusUpdate(id: number) {
    try {
      const brand = await this.repo.findOne({ where: { id } });
      if (!brand) throw new NotFoundException('brand not found');

      brand.status = brand.status === 0 ? 1 : 0;
      const saved = await this.repo.save(brand);

      return toggleStatusResponse('brand', saved.status);
    } catch (err) {
      return errorResponse('Something went wrong', err.message);
    }
  }
}
