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

  async create(dto: CreateDepartmentDto, company_id: number) {
    try {
      const department = this.departmentRepository.create({
        name: dto.name,
        company_id: company_id,
      });

      await this.departmentRepository.save(department);
      const savedDept = await this.findAll(company_id);

      return savedDept;
    } catch (e) {
        throw e;
    }
  }

  async findAll(company_id: number, filterStatus?: number) {
    const status = filterStatus !== undefined ? filterStatus : 1;
    try {
      const departments = await this.departmentRepository
        .createQueryBuilder("department")
        .leftJoin("department.company", "company")
        .select([
          "department.id",
          "department.name",
          "company.company_name", // sirf company name select
          "department.status",
        ])
        .where("department.company_id = :company_id", { company_id })
        .where("department.status = :status", { status })
        .orderBy("department.id", "DESC")
        .getRawMany();
      return departments;
    } catch (e) {
        throw e;
    }
  }

 async findOne(id: number) {
  try {
    const department = await this.departmentRepository
      .createQueryBuilder("department")
      .leftJoin("department.company", "company")
      .select([
        "department.id",
        "department.name",
        "department.status",
        "company.company_name", // sirf company ka name select
      ])
      .where("department.id = :id", { id })
      .getRawOne();

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return department;
  } catch (e) {
      throw e;
  }
}


  async update(id: number, dto: UpdateDepartmentDto, company_id: number) {
    try {
      const department = await this.departmentRepository.findOne({
        where: { id, company_id },
      });

      if (!department) {
        throw new NotFoundException(`Department with ID ${id} not found`);
      }

      if (dto.name) department.name = dto.name;

      await this.departmentRepository.save(department);

      const updatedDept = await this.findAll(company_id);
      return updatedDept;
    } catch (e) {
       throw e;
    }
  }

  async statusUpdate(id: number) {
    try {
      const dep = await this.departmentRepository.findOneBy({ id });
      if (!dep) throw new NotFoundException("Departmentt not found");

      dep.status = dep.status === 0 ? 1 : 0;
      await this.departmentRepository.save(dep);

      return toggleStatusResponse("Department", dep.status);
    } catch (err) {
      return errorResponse("Something went wrong", err.message);
    }
  }
}
