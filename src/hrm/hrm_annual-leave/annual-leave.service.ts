import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnnualLeave } from './annual-leave.entity';
import { CreateAnnualLeaveDto } from './dto/create-annual-leave.dto';
import { UpdateAnnualLeaveDto } from './dto/update-annual-leave.dto';
import { errorResponse, toggleStatusResponse } from 'src/commonHelper/response.util';

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

  findAll(filterStatus?: number) {
        const status = filterStatus !== undefined ? filterStatus : 1;
    return this.repo.find({where: {status}});
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

   async statusUpdate(id: number) {
      try {
        const dep = await this.repo.findOneBy({ id });
        if (!dep) throw new NotFoundException("Annual Leave not found");
  
        dep.status = dep.status === 0 ? 1 : 0;
        await this.repo.save(dep);
  
        return toggleStatusResponse("Annual Leave", dep.status);
      } catch (err) {
        return errorResponse("Something went wrong", err.message);
      }
    }
}

