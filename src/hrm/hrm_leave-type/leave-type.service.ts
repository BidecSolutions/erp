import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveType } from './leave-type.entity';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
import { UpdateLeaveTypeDto } from './dto/update-leave-type.dto';

@Injectable()
export class LeaveTypeService {
  constructor(
    @InjectRepository(LeaveType)
    private leaveTypeRepo: Repository<LeaveType>,
  ) {}

  async create(dto: CreateLeaveTypeDto) {
    const leaveType = this.leaveTypeRepo.create(dto);
    return await this.leaveTypeRepo.save(leaveType);
  }

  async findAll() {
    return await this.leaveTypeRepo.find();
  }

  async findOne(id: number) {
    const leaveType = await this.leaveTypeRepo.findOne({ where: { id } });
    if (!leaveType) throw new NotFoundException(`Leave Type ${id} not found`);
    return leaveType;
  }

  async update(id: number, dto: UpdateLeaveTypeDto) {
    const leaveType = await this.findOne(id);
    Object.assign(leaveType, dto);
    return await this.leaveTypeRepo.save(leaveType);
  }

  async remove(id: number) {
    const leaveType = await this.findOne(id);
    return await this.leaveTypeRepo.remove(leaveType);
  }
}
