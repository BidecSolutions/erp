
import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Designation } from "./designation.entity";
import { CreateDesignationDto } from "./dto/create-designation.dto";
import { UpdateDesignationDto } from "./dto/update-designation.dto";
import { Department } from "../hrm_department/department.entity";
import { errorResponse, toggleStatusResponse } from "src/commonHelper/response.util";

@Injectable()
export class DesignationService {
  constructor(
    @InjectRepository(Designation)
    private readonly designationRepo: Repository<Designation>,

    @InjectRepository(Department)
    private departmentRepo: Repository<Department>
  ) { }

  // ✅ CREATE
  async create(dto: CreateDesignationDto, userId: number, company_id: number) {
    try {
      // 🔹 Check if department belongs to same company
      const department = await this.departmentRepo
        .createQueryBuilder("department")
        .where("department.id = :id", { id: dto.departmentId })
        .andWhere("department.company_id = :company_id", { company_id })
        .getOne();

      if (!department) {
        throw new BadRequestException(
          `Department ID ${dto.departmentId} not found for your company`
        );
      }

      const designation = this.designationRepo.create({
        name: dto.name,
        department_id: dto.departmentId,
        company_id,
        created_by: userId,
      });

      await this.designationRepo.save(designation);

      return await this.findAll(company_id);
    } catch (e) {
      throw e;
    }
  }

  // ✅ FIND ALL
  async findAll(company_id: number, filter?: number) {
    try {
      const qb = this.designationRepo
        .createQueryBuilder("designation")
        .innerJoin("hrm_departments", "department", "designation.department_id  = department.id")
        .select([
          "designation.id AS id",
          "designation.name AS name",
          "designation.status AS status",
          "designation.department_id AS department_id",
          "designation.company_id AS company_id",
          "designation.created_by AS created_by",
          "designation.updated_by AS updated_by",
          "designation.created_at AS created_at",
          "designation.updated_at AS updated_at",
        ])
        .where("designation.company_id = :company_id", { company_id })
        .orderBy("designation.id", "DESC");

      if (filter !== undefined) qb.andWhere("designation.status = :filter", { filter });

      const data = await qb.getRawMany();
      if (!data.length) throw new NotFoundException("No designations found for this company.");

      return data;
    } catch (e) {
      throw e;
    }
  }

  // ✅ FIND ONE
  async findOne(id: number, company_id: number) {
    try {
      const designation = await this.designationRepo
        .createQueryBuilder("designation")
        .leftJoin("hrm_departments", "department", "department.id = designation.department_id")
        .select([
          "designation.id AS id",
          "designation.name AS name",
          "designation.status AS status",
          "designation.department_id AS department_id",
          "designation.company_id AS company_id",
          "designation.created_by AS created_by",
          "designation.updated_by AS updated_by",
          "designation.created_at AS created_at",
          "designation.updated_at AS updated_at",
        ])
        .where("designation.id = :id", { id })
        .andWhere("designation.company_id = :company_id", { company_id })
        .getRawOne();

      if (!designation)
        throw new NotFoundException(`Designation with ID ${id} not found for this company`);

      return designation;
    } catch (e) {
      throw e;
    }
  }

  // ✅ UPDATE
  async update(id: number, dto: UpdateDesignationDto, userId: number, company_id: number) {
    try {
      const designation = await this.designationRepo.findOne({
        where: { id, company_id },
      });

      if (!designation)
        throw new NotFoundException(`Designation with ID ${id} not found for this company`);

      if (dto.departmentId) {
        const department = await this.departmentRepo
          .createQueryBuilder("department")
          .where("department.id = :id", { id: dto.departmentId })
          .andWhere("department.company_id = :company_id", { company_id })
          .getOne();

        if (!department)
          throw new BadRequestException(
            `Department ID ${dto.departmentId} not found for your company`
          );

        designation.department_id = dto.departmentId;
      }

      if (dto.name) designation.name = dto.name;
      designation.updated_by = userId;

      await this.designationRepo.save(designation);

      return await this.findOne(id, company_id);
    } catch (e) {
      throw e;
    }
  }

  // ✅ STATUS TOGGLE
  async statusUpdate(id: number, company_id: number) {
    try {
      const designation = await this.designationRepo.findOneBy({ id, company_id });
      if (!designation) throw new NotFoundException("Designation not found");

      designation.status = designation.status === 0 ? 1 : 0;
      await this.designationRepo.save(designation);

      return toggleStatusResponse("Designation", designation.status);
    } catch (err) {
      return errorResponse("Something went wrong", err.message);
    }
  }
}
