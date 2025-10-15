import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProbationSetting } from "./probation-setting.entity";
import {
  errorResponse,
  toggleStatusResponse,
} from "src/commonHelper/response.util";

@Injectable()
export class ProbationSettingService {
  constructor(
    @InjectRepository(ProbationSetting)
    private probationRepo: Repository<ProbationSetting>
  ) { }
  async create(
    data: {
      leave_days: number;
      probation_period: number;
      duration_type?: "days" | "months";
    },
    company_id: number
  ) {
    try {
      const ps = this.probationRepo.create({
        leave_days: data.leave_days,
        probation_period: data.probation_period,
        duration_type: data.duration_type ?? "months",
        company_id,
      });

      await this.probationRepo.save(ps);
      return await this.findAll(company_id);
    } catch (e) {
      throw e;
    }
  }

  async findAll(company_id: number, filterStatus?: number) {
    try {
      const query = this.probationRepo
        .createQueryBuilder("probation_setting")
        .leftJoin("probation_setting.company", "company")
        .select([
          "probation_setting.id as id",
          "probation_setting.leave_days as leave_days",
          "probation_setting.probation_period as probation_period",
          "probation_setting.duration_type as duration_type",
          "probation_setting.status as status",
          "probation_setting.company_id as company_id",
        ])
        .where("probation_setting.company_id = :company_id", { company_id });

      // ✅ Apply status filter only if provided
      if (filterStatus !== undefined) {
        query.andWhere("probation_setting.status = :status", { status: filterStatus });
      }

      query.orderBy("probation_setting.id", "DESC");

      const settings = await query.getRawMany();
      return settings;
    } catch (e) {
      throw e;
    }
  }
  async findOne(id: number) {
    try {
      const setting = await this.probationRepo
        .createQueryBuilder("probation_setting")
        .leftJoin("probation_setting.company", "company")
        .select([
          "probation_setting.id as id ",
          "probation_setting.leave_days as leave_days",
          "probation_setting.probation_period as probation_period",
          "probation_setting.duration_type as duration_type",
          "probation_setting.status as status",
          "probation_setting.company_id as company_id",
        ])
        .where("probation_setting.id = :id", { id })
        .getRawOne();

      if (!setting)
        throw new NotFoundException(`Probation Setting ID ${id} not found`);

      return setting;
    } catch (e) {
      throw e;
    }
  }

  async update(
    id: number,
    data: {
      leave_days?: number;
      probation_period?: number;
      duration_type?: "days" | "months";
    },
    company_id: number
  ) {
    try {
      // // Find record for same company
      const ps = await this.probationRepo.findOne({
        where: { id, company_id },
      });
      if (!ps)
        throw new NotFoundException(`Probation setting ID ${id} not found`);

      // // Convert days → months if needed
      if (data.duration_type === "days" && data.probation_period) {
        data.probation_period = Math.ceil(data.probation_period / 30);
      }

      if (data.leave_days) ps.leave_days = data.leave_days;
      if (data.probation_period) ps.probation_period = data.probation_period;
      if (data.duration_type) ps.duration_type = data.duration_type;

      await this.probationRepo.save(ps);

      // // Return updated list for company
      const updated = await this.findAll(company_id);
      return updated;
    } catch (e) {
      throw e;
    }
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
