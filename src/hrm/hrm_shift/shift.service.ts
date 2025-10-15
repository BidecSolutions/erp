import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateShiftDto } from "./dto/create-shift.dto";
import { UpdateShiftDto } from "./dto/update-shift.dto";
import { Shift } from "./shift.entity";
import {
  errorResponse,
  toggleStatusResponse,
} from "src/commonHelper/response.util";
import { UpdateEmpRoasterDto } from "./dto/update-emp-roaster.dto";
import { EmpRoaster } from "./emp-roaster.entity";

export interface RoasterResponse {
  id: number;
  shift_id: number;
  shift_name: string | null;
  days: string[];
  start_time: string;
  end_time: string;
}

@Injectable()
export class ShiftService {
  constructor(
    @InjectRepository(Shift)
    private readonly shiftRepo: Repository<Shift>,

    @InjectRepository(EmpRoaster)
    private readonly empRoasterRepo: Repository<EmpRoaster>,
  ) { }


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
    try {
      const shifts = await this.shiftRepo
        .createQueryBuilder("shift")
        .leftJoin("shift.company", "company")
        .select([
         "shift.id as id",
          "shift.name as name",
          "shift.start_time as start_time",
          "shift.end_time as end_time",
          "shift.status as status",
             "shift.company_id as company_id",
        ])
        .where("shift.company_id = :company_id", { company_id })
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
          "shift.id as id",
          "shift.name as name",
          "shift.start_time as start_time",
          "shift.end_time as end_time",
          "shift.status as status",
             "shift.company_id as company_id",
        ])
        .where("shift.id = :id", { id })
        .getRawOne();

      if (!shift) throw new NotFoundException(`Shift ID ${id} not found`);

      return shift;
    } catch (e) {
      throw e;
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

  async statusUpdate(id: number) {
    try {
      const dep = await this.shiftRepo.findOneBy({ id });
      if (!dep) throw new NotFoundException("Shift not found");

      dep.status = dep.status === 0 ? 1 : 0;
      await this.shiftRepo.save(dep);

      return this.findAll(dep.company_id);
    } catch (err) {
      return errorResponse("Something went wrong", err.message);
    }
  }

}
