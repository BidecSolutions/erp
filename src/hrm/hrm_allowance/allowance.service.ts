import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UpdateAllowanceDto } from "./dto/update-allowance.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Allowance } from "./allowance.entity";
import { Company } from "src/Company/companies/company.entity";
import { CreateAllowanceDto } from "./dto/create-allowance.dto";
import { Repository } from "typeorm";
import {
  errorResponse,
  successResponse,
  toggleStatusResponse,
} from "src/commonHelper/response.util";
import { title } from "node:process";

@Injectable()
export class AllowanceService {
  constructor(
    @InjectRepository(Allowance)
    private readonly allowanceRepo: Repository<Allowance>
  ) { }

  //  Create allowance with company
  async create(dto: CreateAllowanceDto, userId: number, company_id: number) {
    try {
      const allowance = this.allowanceRepo.create({
        title: dto.title,
        type: dto.type,
        amount: dto.amount,
        company_id: company_id,
        created_by: userId,
      });

      await this.allowanceRepo.save(allowance);
      const saved = await this.findAll(company_id);
      return successResponse("Allowance created successfully!", saved);
    } catch (error) {
      throw new BadRequestException(
        error.message || "Failed to create Allowance"
      );
    }
  }

  async findAll(company_id: number, filter?: number) {
    try {
      const where: any = {};
      if (filter !== undefined) {
        where.status = filter; // filter apply
      }
      const allowances = await this.allowanceRepo
        .createQueryBuilder("allowance")
        .leftJoin("allowance.company", "company")
        .select([
          "allowance.id as id",
          "allowance.title as title",
          "allowance.type as type",
          "allowance.amount as amount",
          "allowance.status as status",
          "allowance.company_id as company_id",
          "allowance.created_by as created_by",
          "allowance.updated_by as updated_by",
          "allowance.created_at as created_at",
          "allowance.updated_at as updated_at",
        ])
        .where("allowance.company_id = :company_id", { company_id })
        .orderBy("allowance.id", "DESC")
        .getRawMany();


      return successResponse("Get All Allowances successfully!", allowances);
    } catch (error) {
      throw new BadRequestException(
        error.message || "Failed to Get All Allowances"
      );
    }
  }

  async findOne(id: number, company_id: number) {
    try {
      const allowance = await this.allowanceRepo
        .createQueryBuilder("allowance")
        .select([
          "allowance.id as id",
          "allowance.title as title",
          "allowance.type as type",
          "allowance.amount as amount",
          "allowance.status as status",
          "allowance.company_id as company_id",
          "allowance.created_by as created_by",
          "allowance.updated_by as updated_by",
          "allowance.created_at as created_at",
          "allowance.updated_at as updated_at",
        ])
        .where("allowance.id = :id", { id })
        .andWhere("allowance.company_id = :company_id", { company_id })
        .getRawOne();

      if (!allowance)
        throw new NotFoundException(`Allowance ID ${id} not found`);

      return successResponse("Get Allowance successfully!", allowance);
    } catch (error) {
      throw new BadRequestException(
        error.message || "Failed to Get Allowance"
      );
    }
  }

  // Update allowance (only title/type/amount update, NOT company_id)
  async update(
    id: number,
    dto: UpdateAllowanceDto,
    userId: number,
    company_id: number
  ) {
    try {
      const allowance = await this.allowanceRepo.findOne({
        where: { id, company_id },
      });
      if (!allowance)
        throw new NotFoundException(`Allowance ID ${id} not found`);

      if (dto.title) allowance.title = dto.title;
      if (dto.type) allowance.type = dto.type;
      if (dto.amount) allowance.amount = dto.amount;

      allowance.updated_by = userId;
      allowance.company_id = company_id;

      await this.allowanceRepo.save(allowance);
      const updated = await this.allowanceRepo
        .createQueryBuilder("allowance")
        .select([
          "allowance.id",
          "allowance.title",
          "allowance.type",
          "allowance.amount",
          "allowance.status",
          "allowance.company_id",
          "allowance.created_by",
          "allowance.updated_by",
          "allowance.created_at",
          "allowance.updated_at",
        ])
        .where("allowance.id = :id", { id })
        .andWhere("allowance.company_id = :company_id", { company_id })
        .getOne();

      return successResponse("Allowance Updated successfully!", updated);
    } catch (error) {
      throw new BadRequestException(
        error.message || "Failed to Update Allowance"
      );
    }
  }

  async statusUpdate(id: number, company_id: number) {
    try {
      const dep = await this.allowanceRepo.findOneBy({ id });
      if (!dep) throw new NotFoundException("Allowance not found");

      dep.status = dep.status === 0 ? 1 : 0;
      const saved = await this.allowanceRepo.save(dep);


      return toggleStatusResponse("Allowance", saved.status);
    } catch (err) {
      return errorResponse("Something went wrong", err.message);
    }
  }
}
