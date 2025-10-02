import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProbationSetting } from './probation-setting.entity';
import { errorResponse, toggleStatusResponse } from 'src/commonHelper/response.util';

@Injectable()
export class ProbationSettingService {
  constructor(
    @InjectRepository(ProbationSetting)
    private probationRepo: Repository<ProbationSetting>,
  ) {}

  async create(data: { leave_days: number; probation_period: number; duration_type?: 'days' | 'months' }) {
    // 👇 Agar duration_type days hai, to months me convert kar do
    if (data.duration_type === 'days') {
      data.probation_period = Math.ceil(data.probation_period / 30); // approx 30 days = 1 month
    }

    const ps = this.probationRepo.create({
      leave_days: data.leave_days,
      probation_period: data.probation_period, // always months stored in DB
    });

    return await this.probationRepo.save(ps);
  }

  async findAll(filterStatus?: number) {
            const status = filterStatus !== undefined ? filterStatus : 1;
    return await this.probationRepo.find({where: {status}});
  }

  async findOne(id: number) {
    const ps = await this.probationRepo.findOne({ where: { id } });
    if (!ps) throw new NotFoundException('Probation setting not found');
    return ps;
  }

  async update(id: number, data: Partial<ProbationSetting> & { duration_type?: 'days' | 'months' }) {
    const ps = await this.findOne(id);

    // 👇 Same conversion logic for update
    if (data.duration_type === 'days' && data.probation_period) {
      data.probation_period = Math.ceil(data.probation_period / 30);
    }

    Object.assign(ps, data);
    return await this.probationRepo.save(ps);
  }

  async remove(id: number) {
    const ps = await this.findOne(id);
    await this.probationRepo.remove(ps);
    return { message: 'Probation setting removed successfully' };
  }

    async statusUpdate(id: number) {
        try {
          const dep = await this.probationRepo.findOneBy({ id });
          if (!dep) throw new NotFoundException("Probation setting not found");
    
          dep.status = dep.status === 0 ? 1 : 0;
          await this.probationRepo.save(dep);
    
          return toggleStatusResponse("Probation setting", dep.status);
        } catch (err) {
          return errorResponse("Something went wrong", err.message);
        }
      }
}
