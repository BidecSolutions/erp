import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { Shift } from './shift.entity';
import { errorResponse, toggleStatusResponse } from 'src/commonHelper/response.util';

@Injectable()
export class ShiftService {
  constructor(
    @InjectRepository(Shift)
    private readonly shiftRepo: Repository<Shift>,
  ) {}

  async create(dto: CreateShiftDto) {
    const shift = this.shiftRepo.create(dto);
    return await this.shiftRepo.save(shift);
  }

  async findAll(filterStatus?: number) {
    const status = filterStatus !== undefined ? filterStatus : 1;
    return await this.shiftRepo.find({where: {status}});
  }

  async findOne(id: number) {
    const shift = await this.shiftRepo.findOneBy({ id });
    if (!shift) throw new NotFoundException(`Shift ID ${id} not found`);
    return shift;
  }

  async update(id: number, dto: UpdateShiftDto) {
    const shift = await this.findOne(id);
    Object.assign(shift, dto);
    return await this.shiftRepo.save(shift);
  }

  async remove(id: number) {
    const shift = await this.findOne(id);
    await this.shiftRepo.remove(shift);
    return { message: `Shift ID ${id} deleted successfully` };
  }

    async statusUpdate(id: number) {
            try {
              const dep = await this.shiftRepo.findOneBy({ id });
              if (!dep) throw new NotFoundException("Shift not found");
        
              dep.status = dep.status === 0 ? 1 : 0;
              await this.shiftRepo.save(dep);
        
              return toggleStatusResponse("Shift", dep.status);
            } catch (err) {
              return errorResponse("Something went wrong", err.message);
            }
          }
}
