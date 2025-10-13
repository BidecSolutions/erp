import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Designation } from "./designation.entity";
import { CreateDesignationDto } from "./dto/create-designation.dto";
import { UpdateDesignationDto } from "./dto/update-designation.dto";
import { Department } from "../hrm_department/department.entity";
import {
  errorResponse,
} from "src/commonHelper/response.util";

@Injectable()
export class DesignationService {
  constructor(
    @InjectRepository(Designation)
    private designationRepository: Repository<Designation>,

    @InjectRepository(Department)
    private departmentRepo: Repository<Department>
  ) { }

  async create(dto: CreateDesignationDto, company: number) {
    try {
      const department = await this.departmentRepo.findOne({
        where: { id: dto.departmentId },
      });
      if (!department)
        throw new NotFoundException(
          `Department with ID ${dto.departmentId} not found`
        );
      const designation = this.designationRepository.create({
        name: dto.name,
        department,
      });

      await this.designationRepository.save(designation);
      const savedDesignation = await this.findAll(company);
      return savedDesignation;
    } catch (e) {
      throw e;
    }
  }

  async findAll(company: number) {
    try {
      const designations = await this.designationRepository
        .createQueryBuilder("designation")

        .select([
          "designation.id as id",
          "designation.name as name",
          "designation.status as status",
          "department.name as department_name",
          "department.id as department_id",
        ])
        .where("department.company_id = :company", { company })
        .getRawMany();
      return designations;
    } catch (e) {
      throw e;
    }
  }
  //changes 
  async findOne(id: number) {
    try {
      const designation = await this.designationRepository
        .createQueryBuilder("designation")
        .innerJoin("hrm_departments", "department", "designation.department_id  = department.id")
        .select([
          "designation.id as id",
          "designation.name as name",
          "designation.status as status",
          "department.name as department_name",
        ])
        .where("designation.id = :id", { id })
        .getRawOne();

      if (!designation) {
        throw new NotFoundException(`Designation with ID ${id} not found`);
      }

      return designation;
    } catch (e) {
      throw e;
    }
  }

  async update(id: number, dto: UpdateDesignationDto, company: number) {
    try {
      const designation = await this.designationRepository.findOne({
        where: { id },
        relations: ["department"],
      });

      if (!designation) {
        throw new NotFoundException(`Designation with ID ${id} not found`);
      }

      if (dto.departmentId) {
        const department = await this.departmentRepo.findOne({
          where: { id: dto.departmentId },
        });
        if (!department) {
          throw new NotFoundException(
            `Department with ID ${dto.departmentId} not found`
          );
        }
        designation.department = department;
      }

      if (dto.name) {
        designation.name = dto.name;
      }

      await this.designationRepository.save(designation);

      const updatedDesignation = await this.findAll(company);
      return updatedDesignation;
    } catch (e) {
      throw e;
    }
  }

  async statusUpdate(id: number, company: number) {
    try {
      const dep = await this.designationRepository.findOneBy({ id });
      if (!dep) throw new NotFoundException("Designation not found");

      dep.status = dep.status === 0 ? 1 : 0;
      await this.designationRepository.save(dep);

      return this.findAll(company);
    } catch (err) {
      return errorResponse("Something went wrong", err.message);
    }
  }
}
