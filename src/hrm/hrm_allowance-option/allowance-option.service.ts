import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AllowanceOption } from './allowance-option.entity';
import { CreateAllowanceOptionDto } from './dto/create-allowance-option.dto';
import { UpdateAllowanceOptionDto } from './dto/update-allowance-option.dto';

@Injectable()
export class AllowanceOptionService {
  constructor(
    @InjectRepository(AllowanceOption)
    private readonly optionRepo: Repository<AllowanceOption>,
  ) {}

  async create(dto: CreateAllowanceOptionDto) {
    const option = this.optionRepo.create(dto);
    return await this.optionRepo.save(option);
  }

  async findAll() {
    return await this.optionRepo.find();
  }

  async findOne(id: number) {
    const option = await this.optionRepo.findOneBy({ id });
    if (!option) throw new NotFoundException(`Allowance option ID ${id} not found`);
    return option;
  }

  async update(id: number, dto: UpdateAllowanceOptionDto) {
    const option = await this.findOne(id);
    Object.assign(option, dto);
    return await this.optionRepo.save(option);
  }

  async remove(id: number) {
    const option = await this.findOne(id);
    await this.optionRepo.remove(option);
    return { message: `Allowance option ID ${id} deleted successfully` };
  }
}
