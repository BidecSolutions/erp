import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Holiday } from './holiday.entity';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';
import { errorResponse, toggleStatusResponse } from 'src/commonHelper/response.util';

@Injectable()
export class HolidayService {
  constructor(
    @InjectRepository(Holiday)
    private readonly holidayRepo: Repository<Holiday>,
  ) {}

  // ✅ Create Holiday (company_id from token)
  async create(dto: CreateHolidayDto, company_id: number) {
    const holiday = this.holidayRepo.create({ ...dto, company_id });
    await this.holidayRepo.save(holiday);

    return {
      status: true,
      message: 'Holiday created successfully!',
      data: holiday,
    };
  }

  // ✅ Get all holidays (JOIN-style QueryBuilder)
 async findAll(company_id: number, status?: number) {
  const query = this.holidayRepo
    .createQueryBuilder('holiday')
    .where('holiday.company_id = :company_id', { company_id });

  // ✅ If "status" filter is provided, apply it
  if (status !== undefined) {
    query.andWhere('holiday.status = :status', { status });
  }

  // ✅ Else return all (status 0 & 1 both)
  const holidays = await query.getMany();

  return {
    status: true,
    message:
      status !== undefined
        ? `Holidays with status ${status} fetched successfully!`
        : 'All holidays fetched successfully!',
    data: holidays,
  };
}


  // ✅ Get one holiday by ID (JOIN-style)
  async findOne(id: number, company_id: number) {
    const holiday = await this.holidayRepo
      .createQueryBuilder('h')
      .where('h.id = :id', { id })
      .andWhere('h.company_id = :company_id', { company_id })
      .getOne();

    if (!holiday) throw new NotFoundException('Holiday not found!');

    return {
      status: true,
      message: 'Holiday fetched successfully!',
      data: holiday,
    };
  }

  // ✅ Update Holiday (JOIN-style)
  async update(id: number, dto: UpdateHolidayDto, company_id: number) {
    const holiday = await this.holidayRepo
      .createQueryBuilder('h')
      .where('h.id = :id', { id })
      .andWhere('h.company_id = :company_id', { company_id })
      .getOne();

    if (!holiday) throw new NotFoundException('Holiday not found!');

    Object.assign(holiday, dto);
    await this.holidayRepo.save(holiday);

    return {
      status: true,
      message: 'Holiday updated successfully!',
      data: holiday,
    };
  }

    async statusUpdate(id: number) {
      try {
        const lr = await this.holidayRepo.findOneBy({ id });
        if (!lr) throw new NotFoundException("Holiday not found");
  
        lr.status = lr.status === 0 ? 1 : 0;
        await this.holidayRepo.save(lr);
  
        return toggleStatusResponse("Holiday", lr.status);
      } catch (err) {
        return errorResponse("Something went wrong", err.message);
      }
    }

  // ✅ Check if date is a holiday (for attendance logic)
  async isHoliday(date: string, company_id: number): Promise<boolean> {
    const holiday = await this.holidayRepo
      .createQueryBuilder('h')
      .where('h.company_id = :company_id', { company_id })
      .andWhere('h.date = :date', { date })
      .andWhere('h.status = :status', { status: 1 })
      .getOne();

    return !!holiday;
  }
}
