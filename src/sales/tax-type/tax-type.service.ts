import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from 'src/Company/companies/company.entity';
import { errorResponse, toggleStatusResponse } from 'src/commonHelper/response.util';
import { TaxType } from './entity/tax-type.entity';
import { CreateTaxTypeDto, UpdateTaxTypeDto } from './dto/tax-type.dto';

@Injectable()
export class TaxTypeService {
  constructor(
    @InjectRepository(TaxType)
    private readonly taxTypeRepo: Repository<TaxType>,

    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {}

  // ---------------- CREATE ----------------
  async create(dto: CreateTaxTypeDto) {
    const company = await this.companyRepo.findOne({ where: { id: dto.company_id } });
    if (!company) {
      return {
        success: false,
        message: `Company with ID ${dto.company_id} not found`,
      };
    }

    const exists = await this.taxTypeRepo.findOne({ where: { tax_code: dto.tax_code } });
    if (exists) {
      return {
        success: false,
        message: `Tax code "${dto.tax_code}" already exists`,
      };
    }

    const tax = this.taxTypeRepo.create(dto);
    const saved = await this.taxTypeRepo.save(tax);

    return {
      success: true,
      message: 'Tax type created successfully',
      data: saved,
    };
  }

  // ---------------- GET ALL ----------------
  async findAll() {
    const list = await this.taxTypeRepo.find({ order: { id: 'DESC' } });
    return {
      success: true,
      message: 'All tax types fetched',
      data: list,
    };
  }

  // ---------------- GET ONE ----------------
  async findOne(id: number) {
    const tax = await this.taxTypeRepo.findOne({ where: { id } });
    if (!tax) {
      return {
        success: false,
        message: `TaxType with ID ${id} not found`,
      };
    }
    return {
      success: true,
      message: 'Tax type fetched successfully',
      data: tax,
    };
  }

  // ---------------- UPDATE ----------------
  async update(id: number, dto: UpdateTaxTypeDto) {
    const tax = await this.taxTypeRepo.findOne({ where: { id } });
    if (!tax) {
      return {
        success: false,
        message: `TaxType with ID ${id} not found`,
      };
    }

    if (dto.company_id) {
      const company = await this.companyRepo.findOne({ where: { id: dto.company_id } });
      if (!company) {
        return {
          success: false,
          message: `Company with ID ${dto.company_id} not found`,
        };
      }
    }

    if (dto.tax_code && dto.tax_code !== tax.tax_code) {
      const exists = await this.taxTypeRepo.findOne({ where: { tax_code: dto.tax_code } });
      if (exists) {
        return {
          success: false,
          message: `Tax code "${dto.tax_code}" already exists`,
        };
      }
    }

    Object.assign(tax, dto, { updated_at: new Date().toISOString().split('T')[0] });
    const updated = await this.taxTypeRepo.save(tax);

    return {
      success: true,
      message: 'Tax type updated successfully',
      data: updated,
    };
  }

  // ---------------- TOGGLE STATUS ----------------
  async statusUpdate(id: number) {
    try {
      const tax_type = await this.taxTypeRepo.findOne({ where: { id } });
      if (!tax_type) throw new NotFoundException('tax type not found');

      tax_type.status = tax_type.status === 0 ? 1 : 0;
      tax_type.updated_at = new Date().toISOString().split('T')[0];

      const saved = await this.taxTypeRepo.save(tax_type);
      return toggleStatusResponse('tax type', saved.status);
    } catch (err) {
      return errorResponse('Something went wrong', err.message);
    }
  }
}
