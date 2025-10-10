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
    private readonly repo: Repository<UnitOfMeasure>) { }

  async create(createDto: CreateUnitOfMeasureDto, company_id: number) {
    try {
      const unit_of_measure = this.repo.create({ ...createDto, company_id });
      await this.repo.save(unit_of_measure);
      const saved = await this.findAll(company_id);
      return saved;

    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('unit of measure already exists');
      }
      throw new BadRequestException(error.message || 'Failed to create unit_of_measure');
    }
  }
  async findAll(company_id: number, filterStatus?: number) {
    const status = filterStatus !== undefined ? filterStatus : 1; // default active
    try {
      const units = await this.repo
        .createQueryBuilder("unit")
        .leftJoin("unit.company", "company")
        .select([
          "unit.id as id",
          "unit.uom_name as uom_name",
          "unit.uom_code as uom_code",
          "unit.description as description",
          "unit.status as status",
          "company.company_name as company_name",
        ])
        .where("unit.company_id = :company_id", { company_id })
        .andWhere("unit.status = :status", { status })
        .orderBy("unit.id", "DESC")
        .getRawMany();

      return { total_record: units.length, unit_of_measure: units, }
    } catch (error) {
      return errorResponse(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const unit_of_measure = await this.repo
        .createQueryBuilder("unit")
        .leftJoin("unit.company", "company")
        .select([
          "unit.id as id",
          "unit.uom_name as uom_name",
          "unit.uom_code as uom_code",
          "unit.description as description",
          "unit.status as status",
          "company.company_name as company_name",
        ])
        .where("unit.id = :id", { id })
        .getRawOne();

      if (!unit_of_measure) throw new NotFoundException(`Unit of Measure ID ${id} not found`);


      return unit_of_measure;
    } catch (e) {
      return { message: e.message };
    }
  }


  async update(id: number, updateDto: UpdateUnitOfMeasureDto, company_id: number) {
    try {
      const existing = await this.repo.findOne({ where: { id, company_id } });
      if (!existing) {
        return errorResponse(`unit of measure #${id} not found`);
      }

      await this.repo.save({ id, ...updateDto });
      const updated = await this.findAll(company_id);
      return updated;
    } catch (e) {
      return { message: e.message };
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
