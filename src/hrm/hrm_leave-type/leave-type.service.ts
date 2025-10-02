import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveType } from './leave-type.entity';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
import { UpdateLeaveTypeDto } from './dto/update-leave-type.dto';
import { errorResponse, toggleStatusResponse } from 'src/commonHelper/response.util';

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

  async findAll(filterStatus?: number) {
       const status = filterStatus !== undefined ? filterStatus : 1;
    return await this.leaveTypeRepo.find({where: {status}});
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
  
      async statusUpdate(id: number) {
          try {
            const dep = await this.leaveTypeRepo.findOneBy({ id });
            if (!dep) throw new NotFoundException("Leave Type not found");
      
            dep.status = dep.status === 0 ? 1 : 0;
            await this.leaveTypeRepo.save(dep);
      
            return toggleStatusResponse("Leave Type", dep.status);
          } catch (err) {
            return errorResponse("Something went wrong", err.message);
          }
        }
}
