import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDeductionOptionDto } from './dto/create-deduction-option.dto';
import { UpdateDeductionOptionDto } from './dto/update-deduction-option.dto';
import { DeductionOption } from './deduction-option.entity';

@Injectable()
export class DeductionOptionService {
  constructor(
    @InjectRepository(DeductionOption)
    private readonly deductionOptionRepository: Repository<DeductionOption>,
  ) {}

  async create(dto: CreateDeductionOptionDto): Promise<DeductionOption> {
    const option = this.deductionOptionRepository.create(dto);
    return this.deductionOptionRepository.save(option);
  }

  async findAll(): Promise<DeductionOption[]> {
    return this.deductionOptionRepository.find();
  }

  async findOne(id: number): Promise<DeductionOption> {
    const option = await this.deductionOptionRepository.findOne({ where: { id } });
    if (!option) {
      throw new NotFoundException(`Deduction Option with ID ${id} not found`);
    }
    return option;
  }

  async update(id: number, dto: UpdateDeductionOptionDto): Promise<DeductionOption> {
    await this.findOne(id);
    await this.deductionOptionRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const option = await this.findOne(id);
    await this.deductionOptionRepository.remove(option);
  }
}
