import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnnualLeave } from './annual-leave.entity';
import { CreateAnnualLeaveDto } from './dto/create-annual-leave.dto';
import { UpdateAnnualLeaveDto } from './dto/update-annual-leave.dto';

@Injectable()
export class AnnualLeaveService {
  constructor(
    @InjectRepository(AnnualLeave)
    private repo: Repository<AnnualLeave>,
  ) {}

  create(dto: CreateAnnualLeaveDto) {
    const record = this.repo.create(dto);
    return this.repo.save(record);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const record = await this.repo.findOne({ where: { id } });
   if (!record) throw new NotFoundException(`Annual Leave ${id} not found`);
    return record;
  }

  async update(id: number, dto: UpdateAnnualLeaveDto) {
    const record = await this.findOne(id);
       if (!record) throw new NotFoundException(`Annual Leave ${id} not found`);
    Object.assign(record, dto);
    return this.repo.save(record);
  }

  async remove(id: number) {
    const record = await this.findOne(id);
    return this.repo.remove(record);
  }
}

