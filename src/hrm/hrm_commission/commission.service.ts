import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Commission } from './commission.entity';
import { CreateCommissionDto } from './dto/create-commission.dto';
import { UpdateCommissionDto } from './dto/update-commission.dto';

@Injectable()
export class CommissionService {
  constructor(
    @InjectRepository(Commission)
    private readonly commissionRepo: Repository<Commission>,
  ) {}

  async create(dto: CreateCommissionDto) {
    const commission = this.commissionRepo.create(dto);
    return await this.commissionRepo.save(commission);
  }

  async findAll() {
    return await this.commissionRepo.find();
  }

  async findOne(id: number) {
    const commission = await this.commissionRepo.findOneBy({ id });
    if (!commission) throw new NotFoundException(`Commission ID ${id} not found`);
    return commission;
  }

  async update(id: number, dto: UpdateCommissionDto) {
    const commission = await this.commissionRepo.findOneBy({ id });
    if (!commission) throw new NotFoundException(`Commission ID ${id} not found`);
    Object.assign(commission, dto);
    return await this.commissionRepo.save(commission);
  }

  async remove(id: number) {
    const commission = await this.commissionRepo.findOneBy({ id });
    if (!commission) throw new NotFoundException(`Commission ID ${id} not found`);
    await this.commissionRepo.remove(commission);
    return { message: `Commission ID ${id} deleted successfully` };
  }
}
