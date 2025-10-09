import { Injectable, NotFoundException } from "@nestjs/common";
import { UpdateAllowanceDto } from "./dto/update-allowance.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Allowance } from "./allowance.entity";
import { Company } from "src/Company/companies/company.entity";
import { CreateAllowanceDto } from "./dto/create-allowance.dto";
import { Repository } from "typeorm";
import { errorResponse, toggleStatusResponse } from "src/commonHelper/response.util";

@Injectable()
export class AllowanceService {
  constructor(
    @InjectRepository(Allowance)
    private readonly allowanceRepo: Repository<Allowance>,

  ) { }

  //  Create allowance with company
  async create(dto: CreateAllowanceDto, company_id: number) {
    try {
      const allowance = this.allowanceRepo.create({
        title: dto.title,
        type: dto.type,
        amount: dto.amount,
        company_id,
      });

      await this.allowanceRepo.save(allowance);
      const saved = await this.findAll(company_id);
      return saved;
    } catch (e) {
      return { message: e.message };
    }
  }


  async findAll(company_id: number) {
    try {
      const allowances = await this.allowanceRepo
        .createQueryBuilder("allowance")
        .leftJoin("allowance.company", "company")
        .select([
          "allowance.id",
          "allowance.title",
          "allowance.type",
          "allowance.amount",
          "allowance.status",
          "company.company_name",
        ])
        .where("allowance.company_id = :company_id", { company_id })
        .orderBy("allowance.id", "DESC")
        .getRawMany();

      return allowances;
    } catch (e) {
      return { message: e.message };
    }
  }


  async findOne(id: number) {
    try {
      const allowance = await this.allowanceRepo
        .createQueryBuilder("allowance")
        .leftJoin("allowance.company", "company")
        .select([
          "allowance.id",
          "allowance.title",
          "allowance.type",
          "allowance.amount",
          "allowance.status",
          "company.company_name",
        ])
        .where("allowance.id = :id", { id })
        .getRawOne();

      if (!allowance) throw new NotFoundException(`Allowance ID ${id} not found`);

      return allowance;
    } catch (e) {
      return { message: e.message };
    }
  }

  // Update allowance (only title/type/amount update, NOT company_id)
  async update(id: number, dto: UpdateAllowanceDto, company_id: number) {
    try {
      const allowance = await this.allowanceRepo.findOne({ where: { id, company_id } });
      if (!allowance) throw new NotFoundException(`Allowance ID ${id} not found`);

      if (dto.title) allowance.title = dto.title;
      if (dto.type) allowance.type = dto.type;
      if (dto.amount) allowance.amount = dto.amount;

      await this.allowanceRepo.save(allowance);

      const updated = await this.findAll(company_id);
      return updated;
    } catch (e) {
      return { message: e.message };
    }
  }



  async statusUpdate(id: number, company_id: number) {
    try {
      const dep = await this.allowanceRepo.findOneBy({ id });
      if (!dep) throw new NotFoundException("Allowance not found");

      dep.status = dep.status === 0 ? 1 : 0;
      await this.allowanceRepo.save(dep);

      return this.findAll(dep.company_id);
    } catch (err) {
      return errorResponse("Something went wrong", err.message);
    }
  }
}
