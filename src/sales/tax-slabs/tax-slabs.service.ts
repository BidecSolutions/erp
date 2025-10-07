import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaxType } from '../tax-type/entity/tax-type.entity';
import { TaxSlab } from './entity/tax-slabs.entity';
import { CreateTaxSlabDto, UpdateTaxSlabDto } from './dto/tax-slabs.dto';
import { errorResponse, toggleStatusResponse } from 'src/commonHelper/response.util';

@Injectable()
export class TaxSlabService {
  constructor(
    @InjectRepository(TaxSlab)
    private readonly slabRepo: Repository<TaxSlab>,

    @InjectRepository(TaxType)
    private readonly typeRepo: Repository<TaxType>,
  ) {}

  // ---------------- CREATE ----------------
async create(dto: CreateTaxSlabDto) {
  const taxType = await this.typeRepo.findOne({ where: { id: dto.tax_type_id } });
  if (!taxType) throw new NotFoundException(`TaxType ID ${dto.tax_type_id} not found`);

  if (dto.from_amount && dto.to_amount && dto.from_amount >= dto.to_amount) {
    throw new BadRequestException(`from_amount must be less than to_amount`);
  }

  // // Either percentage or fixed required
  if (!dto.tax_rate && !dto.fixed_amount) {
    throw new BadRequestException(`Either tax_rate or fixed_amount must be provided`);
  }

  // // Auto-calculate fixed_amount if tax_rate is provided
  let fixedAmount = dto.fixed_amount;
  if (dto.tax_rate && dto.from_amount && dto.to_amount) {
    const taxableRange = dto.to_amount - dto.from_amount;
    fixedAmount = (taxableRange * dto.tax_rate) / 100;
  }

  const slab = this.slabRepo.create({
    ...dto,
    fixed_amount: fixedAmount,
  });

  const saved = await this.slabRepo.save(slab);

  return {
    success: true,
    message: 'Tax slab created successfully',
    data: saved,
  };
}

  // ---------------- GET ALL ----------------
  async findAll() {
    const slabs = await this.slabRepo.find({ relations: ['taxType'] });
    return {
      success: true,
      message: 'Tax slabs fetched successfully',
      data: slabs,
    };
  }

  // ---------------- GET ONE ----------------
  async findOne(id: number) {
    const slab = await this.slabRepo.findOne({ where: { id }, relations: ['taxType'] });
    if (!slab) throw new NotFoundException(`TaxSlab ID ${id} not found`);

    return {
      success: true,
      message: 'Tax slab fetched successfully',
      data: slab,
    };
  }

  // ---------------- UPDATE ----------------
async update(id: number, dto: UpdateTaxSlabDto) {
  const existing = await this.slabRepo.findOne({ where: { id } });
  if (!existing) throw new NotFoundException(`TaxSlab ID ${id} not found`);

  if (dto.tax_type_id) {
    const taxType = await this.typeRepo.findOne({ where: { id: dto.tax_type_id } });
    if (!taxType) throw new NotFoundException(`TaxType ID ${dto.tax_type_id} not found`);
  }

  if (dto.from_amount && dto.to_amount && dto.from_amount >= dto.to_amount) {
    throw new BadRequestException(`from_amount must be less than to_amount`);
  }

  if (dto.tax_rate === null && dto.fixed_amount === null) {
    throw new BadRequestException(`Either tax_rate or fixed_amount must be provided`);
  }

  // // Auto calculate fixed_amount if tax_rate + range available
  let fixedAmount = dto.fixed_amount ?? existing.fixed_amount;
  const from = dto.from_amount ?? existing.from_amount;
  const to = dto.to_amount ?? existing.to_amount;

  if (dto.tax_rate && from && to) {
    const taxableRange = to - from;
    fixedAmount = (taxableRange * dto.tax_rate) / 100;
  }

  Object.assign(existing, dto, {
    fixed_amount: fixedAmount,
    updated_at: new Date().toISOString().split('T')[0],
  });

  const updated = await this.slabRepo.save(existing);

  return {
    success: true,
    message: 'Tax slab updated successfully',
    data: updated,
  };
}

  // ---------------- TOGGLE STATUS ----------------
 
  async statusUpdate(id: number) {
      try {
        const tax_slab = await this.slabRepo.findOne({ where: { id } });
        if (!tax_slab) throw new NotFoundException('tax slab not found');
  
        tax_slab.status = tax_slab.status === 0 ? 1 : 0;
        tax_slab.updated_at = new Date().toISOString().split('T')[0];
  
        const saved = await this.slabRepo.save(tax_slab);
        return toggleStatusResponse('tax slab', saved.status);
      } catch (err) {
        return errorResponse('Something went wrong', err.message);
      }
    }
  }
