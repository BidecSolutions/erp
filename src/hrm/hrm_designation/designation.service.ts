import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Designation } from "./designation.entity";
import { CreateDesignationDto } from "./dto/create-designation.dto";
import { UpdateDesignationDto } from "./dto/update-designation.dto";
import { Department } from "../hrm_department/department.entity";
import {
  errorResponse,
  toggleStatusResponse,
} from "src/commonHelper/response.util";

@Injectable()
export class DesignationService {
  constructor(
    @InjectRepository(Designation)
    private designationRepository: Repository<Designation>,

    @InjectRepository(Department)
    private departmentRepo: Repository<Department>
  ) {}

  async create(dto: CreateDesignationDto) {
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
      const savedDesignation = await this.findAll();
      return savedDesignation;
    } catch (e) {
      throw e;
    }
  }

  async findAll(filterStatus?: number) {
    const status = filterStatus !== undefined ? filterStatus : 1;

    try {
      const designations = await this.designationRepository
        .createQueryBuilder("designation")
            
        .select([
          "designation.id",
          "designation.name",
          "designation.status",
           "department.id", 
          "department.name", 

        ])
        .where("designation.status = :status", { status })
        .orderBy("designation.id", "DESC")
        .getRawMany();

      return designations;
    } catch (e) {
      throw e;
    }
  }

  async findOne(id: number) {
    try {
      const designation = await this.designationRepository
        .createQueryBuilder("designation")
        .leftJoin("designation.department", "department")
        .select([
          "designation.id",
          "designation.name",
          "designation.status",
          "department.id",
          "department.name",
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

  async update(id: number, dto: UpdateDesignationDto) {
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

      const updatedDesignation = await this.findAll();
      return updatedDesignation;
    } catch (e) {
      throw e;
    }
  }

  async statusUpdate(id: number) {
    try {
      const dep = await this.designationRepository.findOneBy({ id });
      if (!dep) throw new NotFoundException("Designation not found");

      dep.status = dep.status === 0 ? 1 : 0;
      await this.designationRepository.save(dep);

      return toggleStatusResponse("Designation", dep.status);
    } catch (err) {
      return errorResponse("Something went wrong", err.message);
    }
  }
}
