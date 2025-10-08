import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AnnualLeave } from "./annual-leave.entity";
import { CreateAnnualLeaveDto } from "./dto/create-annual-leave.dto";
import { UpdateAnnualLeaveDto } from "./dto/update-annual-leave.dto";
import {
  errorResponse,
  toggleStatusResponse,
} from "src/commonHelper/response.util";

@Injectable()
export class AnnualLeaveService {
  constructor(
    @InjectRepository(AnnualLeave)
    private repo: Repository<AnnualLeave>
  ) {}

  async create(dto: CreateAnnualLeaveDto, company_id: number) {
    try {
      const annualLeave = this.repo.create({
        ...dto,
        company_id,
      });

      await this.repo.save(annualLeave);
      const saved = await this.findAll(company_id);

      return saved;
    } catch (e) {
      throw e;
    }
  }

  async findAll(company_id: number, filterStatus?: number) {
    const status = filterStatus !== undefined ? filterStatus : 1;
    try {
      const annualLeave = await this.repo
        .createQueryBuilder("annual_leave")
        .leftJoin("annual_leave.company", "company")
        .select([
          "annual_leave.id as annual_leave",
          "annual_leave.name as name",
          "annual_leave.total_leave as total_leave",
          "annual_leave.status as statu",
          "company.company_name as company_name", // sirf company name
        ])
        .where("annual_leave.company_id = :company_id", { company_id })
        .andWhere("annual_leave.status = :status", { status })
        .orderBy("annual_leave.id", "DESC")
        .getRawMany();

      return annualLeave;
    } catch (e) {
      throw e;
    }
  }

  async findOne(id: number) {
    try {
      const annualLeave = await this.repo
        .createQueryBuilder("annual_leave")
        .leftJoin("annual_leave.company", "company")
        .select([
          "annual_leave.id as annual_leave",
          "annual_leave.name as name",
          "annual_leave.total_leave as total_leave",
          "annual_leave.status as statu",
          "company.company_name ascompany_name", // sirf company name
        ])
        .where("annual_leave.id = :id", { id })
        .getRawOne();

      if (!annualLeave) {
        throw new NotFoundException(`Annual Leave with ID ${id} not found`);
      }

      return annualLeave;
    } catch (e) {
      throw e;
    }
  }

  async update(id: number, dto: UpdateAnnualLeaveDto, company_id: number) {
    try {
      const annualLeave = await this.repo.findOne({
        where: { id, company_id },
      });

      if (!annualLeave) {
        throw new NotFoundException(`Annual Leave with ID ${id} not found`);
      }

      Object.assign(annualLeave, dto);

      await this.repo.save(annualLeave);

      const updated = await this.findAll(company_id);
      return updated;
    } catch (e) {
      throw e;
    }
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
