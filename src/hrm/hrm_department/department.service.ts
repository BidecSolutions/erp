import { Injectable, NotFoundException } from "@nestjs/common";
import { Department } from "./department.entity";
import { UpdateDepartmentDto } from "./dto/update-department.dto";
import { createQueryBuilder, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Company } from "src/Company/companies/company.entity";
import { CreateDepartmentDto } from "./dto/create-department.dto";
import {
  errorResponse,
  toggleStatusResponse,
} from "src/commonHelper/response.util";

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,

    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>
  ) {}

  async create(dto: CreateDepartmentDto, userId: number, company_id: number) {
    try {
      const department = this.departmentRepository.create({
        name: dto.name,
        company_id: company_id,
        created_by: userId,
      });

      await this.departmentRepository.save(department);
      const savedDept = await this.findAll(company_id);

      return savedDept;
    } catch (e) {
      throw e;
    }
  }

  async findAll(company_id: number, filterStatus?: number) {
    try {
      const where: any = {};
      if (filterStatus !== undefined) {
        where.status = filterStatus; // filter apply
      }
      const departments = await this.departmentRepository
        .createQueryBuilder("department")
        .leftJoin("department.company", "company")
        .select([
          "department.id as id",
          "department.name as name",
          "department.status as status",
          "department.company_id as company_id",
          "department.created_by as created_by",
          "department.updated_by as updated_by",
          "department.created_at as created_at",
          "department.updated_at as updated_at",
        ])
        .where("department.company_id = :company_id", { company_id })
        .orderBy("department.id", "DESC")
        .getRawMany();
      return departments;
    } catch (e) {
      throw e;
    }
  }

  async findOne(id: number, company_id: number) {
    try {
      const department = await this.departmentRepository
        .createQueryBuilder("department")
        .select([
    "department.id as id",
          "department.name as name",
          "department.status as status",
          "department.company_id as company_id",
          "department.created_by as created_by",
          "department.updated_by as updated_by",
          "department.created_at as created_at",
          "department.updated_at as updated_at",
        ])
        .where("department.id = :id", { id })
        .andWhere("department.company_id = :company_id", { company_id })
        .getRawOne();

      if (!department) {
        throw new NotFoundException(`Department with ID ${id} not found`);
      }

      return department;
    } catch (e) {
      throw e;
    }
  }

  async update(
    id: number,
    dto: UpdateDepartmentDto,
    userId: number,
    company_id: number
  ) {
    try {
      const department = await this.departmentRepository.findOne({
        where: { id, company_id },
      });

      if (!department) {
        throw new NotFoundException(`Department with ID ${id} not found`);
      }

      if (dto.name) department.name = dto.name;

      department.updated_by = userId;
      department.company_id = company_id;

      await this.departmentRepository.save(department);
      const updatedDept = await this.departmentRepository
        .createQueryBuilder("department")
        .select([
          "department.id as id",
          "department.name as name",
          "department.status as status",
          "department.company_id as company_id",
          "department.created_by as created_by",
          "department.updated_by as updated_by",
          "department.created_at as created_at",
          "department.updated_at as updated_at",
        ])
        .where("department.id = :id", { id })
        .andWhere("department.company_id = :company_id", { company_id })
        .getRawOne();

      return updatedDept;
    } catch (e) {
      throw e;
    }
  }

  async statusUpdate( id: number,company_id: number) {
    try {
      const dep = await this.departmentRepository.findOneBy({ id ,company_id});
      if (!dep) throw new NotFoundException("Departmentt not found");

      dep.status = dep.status === 0 ? 1 : 0;
      const saved = await this.departmentRepository.save(dep);

         return toggleStatusResponse("Departmentt", saved.status);
    } catch (err) {
      return errorResponse("Something went wrong", err.message);
    }
  }
}
