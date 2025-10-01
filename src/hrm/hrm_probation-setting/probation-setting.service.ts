import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProbationSetting } from './probation-setting.entity';

@Injectable()
export class ProbationSettingService {
  constructor(
    @InjectRepository(ProbationSetting)
    private readonly probationRepo: Repository<ProbationSetting>,
  ) {}

  async create(data: { leave_days: number; probation_period: number }) {
    const ps = this.probationRepo.create(data);
    return await this.probationRepo.save(ps);
  }

  async findAll() {
    return await this.probationRepo.find();
  }

  async findOne(id: number) {
    const ps = await this.probationRepo.findOne({ where: { id } });
    if (!ps) throw new NotFoundException('Probation setting not found');
    return ps;
  }

  async update(id: number, data: Partial<ProbationSetting>) {
    const ps = await this.findOne(id);
    Object.assign(ps, data);
    return await this.probationRepo.save(ps);
  }

  async remove(id: number) {
    const ps = await this.findOne(id);
    await this.probationRepo.remove(ps);
    return { message: 'Probation setting removed successfully' };
  }
}
