import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Allowance, AllowanceType } from './allowance.entity';
import { CreateAllowanceDto } from '../hrm_allowance/dto/create-allowance.dto';
import { UpdateAllowanceDto } from './dto/update-allowance.dto';
import { AllowanceOption } from '../hrm_allowance-option/allowance-option.entity';


@Injectable()
export class AllowanceService {
  constructor(
    @InjectRepository(Allowance)
    private readonly allowanceRepo: Repository<Allowance>,
    @InjectRepository(AllowanceOption)
    private readonly optionRepo: Repository<AllowanceOption>,
  ) {}

  async create(dto: CreateAllowanceDto) {
    const option = await this.optionRepo.findOneBy({ id: dto.allowanceOptionId });
    if (!option) throw new NotFoundException('Allowance Option not found');

    const newAllowance = this.allowanceRepo.create({
      allowanceOption: option,
      title: dto.title,
      type: dto.type,
      amount: dto.amount,
    });

    const saved = await this.allowanceRepo.save(newAllowance);

    return {
      id: saved.id,
      allowanceOption: option.name,
      title: saved.title,
      type: saved.type,
      amount: saved.amount,
    };
  }

  async findAll() {
    const allowances = await this.allowanceRepo.find({ relations: ['allowanceOption'] });
    return allowances.map(a => ({
      id: a.id,
      allowanceOption: a.allowanceOption?.name || null,
      title: a.title,
      type: a.type,
      amount: a.amount,
    }));
  }

  async findOne(id: number) {
    const a = await this.allowanceRepo.findOne({
      where: { id },
      relations: ['allowanceOption'],
    });
    if (!a) throw new NotFoundException(`Allowance ID ${id} not found`);

    return {
      id: a.id,
      allowanceOption: a.allowanceOption?.name || null,
      title: a.title,
      type: a.type,
      amount: a.amount,
    };
  }

  async update(id: number, dto: UpdateAllowanceDto) {
    const allowance = await this.allowanceRepo.findOne({ where: { id }, relations: ['allowanceOption'] });
    if (!allowance) throw new NotFoundException(`Allowance ID ${id} not found`);

    if (dto.allowanceOptionId) {
      const option = await this.optionRepo.findOneBy({ id: dto.allowanceOptionId });
      if (!option) throw new NotFoundException('Allowance Option not found');
      allowance.allowanceOption = option;
    }

    Object.assign(allowance, dto);
    const saved = await this.allowanceRepo.save(allowance);

    return {
      id: saved.id,
      allowanceOption: saved.allowanceOption?.name || null,
      title: saved.title,
      type: saved.type,
      amount: saved.amount,
    };
  }

  async remove(id: number) {
    const allowance = await this.allowanceRepo.findOneBy({ id });
    if (!allowance) throw new NotFoundException(`Allowance ID ${id} not found`);
    await this.allowanceRepo.remove(allowance);
    return { message: `Allowance ID ${id} deleted successfully` };
  }
}
