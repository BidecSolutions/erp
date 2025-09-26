import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveSetup } from './leave-setup.entity';
import { CreateLeaveSetupDto } from './dto/create-leave-setup.dto';
import { UpdateLeaveSetupDto } from './dto/update-leave-setup.dto';

@Injectable()
export class LeaveSetupService {
  constructor(
    @InjectRepository(LeaveSetup)
    private leaveSetupRepo: Repository<LeaveSetup>,
  ) {}

  async create(dto: CreateLeaveSetupDto): Promise<LeaveSetup> {
    const leaveSetup = this.leaveSetupRepo.create(dto);
    return await this.leaveSetupRepo.save(leaveSetup);
  }

  async findAll(): Promise<LeaveSetup[]> {
    return await this.leaveSetupRepo.find({ relations: ['employees'] });
  }

  async findOne(id: number): Promise<LeaveSetup> {
    const leaveSetup = await this.leaveSetupRepo.findOne({
      where: { id },
      relations: ['employees'],
    });
    if (!leaveSetup) throw new NotFoundException(`Leave Setup ${id} not found`);
    return leaveSetup;
  }

 async update(id: number, dto: UpdateLeaveSetupDto): Promise<any> {
  const leaveSetup = await this.leaveSetupRepo.findOne({ where: { id } });
  if (!leaveSetup) throw new NotFoundException(`Leave Setup ${id} not found`);

  Object.assign(leaveSetup, dto);
  const saved = await this.leaveSetupRepo.save(leaveSetup);

  return {
    id: saved.id,
    total_leave: saved.total_leave,
    leave_remaining: saved.leave_remaining,
    year: saved.year,
  };
}

  async remove(id: number): Promise<{ message: string }> {
    const leaveSetup = await this.findOne(id);
    await this.leaveSetupRepo.remove(leaveSetup);
    return { message: `Leave Setup ${id} deleted successfully` };
  }
}
