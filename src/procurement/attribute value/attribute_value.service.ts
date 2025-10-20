import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { errorResponse, generateCode, successResponse, toggleStatusResponse } from 'src/commonHelper/response.util';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { } from 'typeorm/browser';
import { AttributeValue } from './Entity/attribute_value.entity';
import { AttributeValueDto, UpdateAttributeValueDto } from './dto/attribute-value.dto';


@Injectable()
export class AttributeValueService {
  constructor(
    @InjectRepository(AttributeValue)
    private readonly repo: Repository<AttributeValue>,
    private readonly dataSource: DataSource,

  ) { }

  async create(dto: AttributeValueDto, companyId: number, userId: number) {
    try {
      const attribute = this.repo.create({
        ...dto,
        company_id: companyId,
        created_by: userId
      });
      await this.repo.save(attribute);
      return successResponse('Attribute  created successfully!', attribute);

    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('attribute  already exists');
      }
      throw new BadRequestException(error.message || 'Failed to create attribute');
    }
  }
  async findAll(companyId: number) {
    try {
      const [attribute, total] = await this.repo.findAndCount({
        where: { company_id: companyId },
        order: { id: 'DESC' },
      });

      return successResponse('Attribute retrieved successfully!', {
        total_record: total,
        attribute,
      });
    } catch (error) {
      return errorResponse('Failed to retrieve attribute', error.message);
    }
  }
  async findOne(id: number, companyId: number) {
    try {
      const attribute = await this.repo.findOne({
        where: { id, company_id: companyId }
      }
      );
      if (!attribute) {
        return errorResponse(`attribute #${id} not found`);
      }
      return successResponse('attribute retrieved successfully!', attribute);
    } catch (error) {
      return errorResponse('Failed to retrieve attribute', error.message);
    }
  }
  async update(id: number, updateDto: UpdateAttributeValueDto, company_id: number, userId: number) {
    try {
      const existing = await this.repo.findOne({
        where: { id, company_id },
      });
      if (!existing) {
        return errorResponse(`Attribute #${id} not found`);
      }

      const attribute = await this.repo.save({
        id,
        ...updateDto,
        company_id: company_id,
        updated_by: userId
      });
      return successResponse('Attribute updated successfully!', attribute);
    } catch (error) {
      return errorResponse('Failed to update attribute', error.message);
    }
  }
  async statusUpdate(id: number) {
    try {
      const attribute = await this.repo.findOne({ where: { id } });
      if (!attribute) throw new NotFoundException('attribute not found');

      attribute.status = attribute.status === 0 ? 1 : 0;
      const saved = await this.repo.save(attribute);

      return toggleStatusResponse('Attribute', saved.status);
    } catch (err) {
      return errorResponse('Something went wrong', err.message);
    }
  }
}
