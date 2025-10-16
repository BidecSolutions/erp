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
  ) { }

  async create(dto: CreateAnnualLeaveDto, userId: number, company_id: number) {
    try {
      const annualLeave = this.repo.create({
        ...dto,
        company_id: company_id,
        created_by: userId,
      });

      await this.repo.save(annualLeave);
      const saved = await this.findAll(company_id);

      return saved;
    } catch (e) {
      throw e;
    }
  }

  async findAll(company_id: number, filter?: number) {
    try {
      const where: any = {};
      if (filter !== undefined) {
        where.status = filter; // filter apply
      }
      const annualLeave = await this.repo
        .createQueryBuilder("annual_leave")
        .leftJoin("annual_leave.company", "company")
        .select([
          "annual_leave.id as id",
          "annual_leave.name as name",
          "annual_leave.total_leave as total_leave",
          "annual_leave.status as status",
          "annual_leave.company_id as company_id",
          "annual_leave.created_by as created_by",
          "annual_leave.updated_by as updated_by",
          "annual_leave.created_at as created_at",
          "annual_leave.updated_at as updated_at",
        ])
        .where("annual_leave.company_id = :company_id", { company_id })
        .orderBy("annual_leave.id", "DESC")
        .getRawMany();

      return annualLeave;
    } catch (e) {
      throw e;
    }
  }

  async findOne(id: number, company_id: number) {
    try {
      const annualLeave = await this.repo
        .createQueryBuilder("annual_leave")
        .select([
          "annual_leave.id as id",
          "annual_leave.name as name",
          "annual_leave.total_leave as total_leave",
          "annual_leave.status as status",
          "annual_leave.company_id as company_id",
          "annual_leave.created_by as created_by",
          "annual_leave.updated_by as updated_by",
          "annual_leave.created_at as created_at",
          "annual_leave.updated_at as updated_at",
        ])
        .where("annual_leave.id = :id", { id })
        .andWhere("annual_leave.company_id = :company_id", { company_id })
        .getRawOne();

      if (!annualLeave) {
        throw new NotFoundException(`Annual Leave with ID ${id} not found`);

      }

      return annualLeave;
    } catch (e) {
      throw e;
    }
  }

  async update(id: number, dto: UpdateAnnualLeaveDto, userId: number, company_id: number) {
    try {
      const annualLeave = await this.repo.findOne({
        where: { id, company_id },
      });

      if (!annualLeave) {
        throw new NotFoundException(`Annual Leave with ID ${id} not found`);
      }

      Object.assign(annualLeave, dto, {
        company_id,
        updated_by: userId,
      });

      await this.repo.save(annualLeave);
      const updated = await this.repo
        .createQueryBuilder("annualLeave")
        .select([
          "annualLeave.id",
          "annualLeave.name",
          "annualLeave.total_leave",
          "annualLeave.status",
          "annualLeave.company_id",
          "annualLeave.created_by",
          "annualLeave.updated_by",
          "annualLeave.created_at",
          "annualLeave.updated_at",
        ])
        .where("annualLeave.id = :id", { id })
        .andWhere("annualLeave.company_id = :company_id", { company_id })
        .getOne();


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
      const saved = await this.repo.save(dep);
      return toggleStatusResponse("Annual Leave", saved.status);
    } catch (err) {
      return errorResponse("Something went wrong", err.message);
    }
  }
}
