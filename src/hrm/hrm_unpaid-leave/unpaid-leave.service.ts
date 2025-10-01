import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { UnpaidLeave } from './unpaid-leave.entity';
import { CreateUnpaidLeaveDto } from './dto/create-unpaid-leave.dto';
import { UpdateUnpaidLeaveDto } from './dto/update-unpaid-leave.dto';
import { Employee } from '../hrm_employee/employee.entity';
import { LeaveRequest } from '../hrm_leave-request/leave-request.entity';

@Injectable()
export class UnpaidLeaveService {
  constructor(
    @InjectRepository(UnpaidLeave)
    private repo: Repository<UnpaidLeave>,
  ) {}

async create(dto: CreateUnpaidLeaveDto) {
  const record = this.repo.create({
    employee: { id: dto.employeeId } as DeepPartial<Employee>,
    leaveRequest: { id: dto.leaveRequestId } as DeepPartial<LeaveRequest>,
    extra_days: dto.extra_days,
  });

  return this.repo.save(record);
}
  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) throw new NotFoundException('Unpaid Leave not found');
    return record;
  }

  async update(id: number, dto: UpdateUnpaidLeaveDto) {
    const record = await this.findOne(id);
    Object.assign(record, dto);
    return this.repo.save(record);
  }

  async remove(id: number) {
    const record = await this.findOne(id);
    return this.repo.remove(record);
  }
}
