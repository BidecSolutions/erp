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

async create(dto: CreateShiftDto, company_id: number) {
  try {
    const shift = this.shiftRepo.create({
      ...dto,
      company_id, // direct assign company id
    });

    await this.shiftRepo.save(shift);
    const saved = await this.findAll(company_id);
    return saved;
  } catch (e) {
    return { message: e.message };
  }
}


  async findAll(company_id: number, filterStatus?: number) {
  const status = filterStatus !== undefined ? filterStatus : 1;
  try {
    const shifts = await this.shiftRepo
      .createQueryBuilder("shift")
      .leftJoin("shift.company", "company")
      .select([
        "shift.id",
        "shift.name",
        "shift.status",
        "company.company_name",
      ])
      .where("shift.company_id = :company_id", { company_id })
      .andWhere("shift.status = :status", { status })
      .orderBy("shift.id", "DESC")
      .getRawMany();

    return shifts;
  } catch (e) {
    return { message: e.message };
  }
}


 async findOne(id: number) {
  try {
    const shift = await this.shiftRepo
      .createQueryBuilder("shift")
      .leftJoin("shift.company", "company")
      .select([
        "shift.id",
        "shift.name",
        "shift.status",
        "company.company_name",
      ])
      .where("shift.id = :id", { id })
      .getRawOne();

    if (!shift) throw new NotFoundException(`Shift ID ${id} not found`);

    return shift;
  } catch (e) {
    return { message: e.message };
  }
}


async update(id: number, dto: UpdateShiftDto, company_id: number) {
  try {
    const shift = await this.shiftRepo.findOne({ where: { id, company_id } });
    if (!shift) throw new NotFoundException(`Shift ID ${id} not found`);

    if (dto.name) shift.name = dto.name;

    await this.shiftRepo.save(shift);

    const updated = await this.findAll(company_id);
    return updated;
  } catch (e) {
    return { message: e.message };
  }
}


  // async remove(id: number) {
  //   const shift = await this.findOne(id);
  //   await this.shiftRepo.remove(shift);
  //   return { message: `Shift ID ${id} deleted successfully` };
  // }

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
