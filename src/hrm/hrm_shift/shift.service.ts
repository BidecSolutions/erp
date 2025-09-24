import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { Shift } from './shift.entity';

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

  async findAll() {
    return await this.shiftRepo.find();
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
}
