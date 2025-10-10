import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LeaveType } from "./leave-type.entity";
import { CreateLeaveTypeDto } from "./dto/create-leave-type.dto";
import { UpdateLeaveTypeDto } from "./dto/update-leave-type.dto";
import {
  errorResponse,
  toggleStatusResponse,
} from "src/commonHelper/response.util";
import { Company } from "src/Company/companies/company.entity";

@Injectable()
export class LeaveTypeService {
  constructor(
    @InjectRepository(LeaveType)
    private leaveTypeRepo: Repository<LeaveType>,

    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) { }

  // Create LeaveType with company
  async create(dto: CreateLeaveTypeDto, company_id: number) {
    try {
      const leaveType = this.leaveTypeRepo.create({
        ...dto,
        company_id, // assign company_id directly
      });

      await this.leaveTypeRepo.save(leaveType);
      const saved = await this.findAll(company_id);
      return saved;
    } catch (e) {
      throw e;
    }
  }

  // Get all LeaveTypes for a company
  async findAll(company_id: number) {
    try {
      const leaveTypes = await this.leaveTypeRepo
        .createQueryBuilder("leave_type")
        .leftJoin("leave_type.company", "company")
        .select([
          "leave_type.id as id",
          "leave_type.leave_type as leave_type",
          "leave_type.statusnotific as status",
                "leave_type.company_id as company_id", 
        ])
        .where("leave_type.company_id = :company_id", { company_id })
        .orderBy("leave_type.id", "DESC")
        .getRawMany();

      return leaveTypes;
    } catch (e) {
      throw e;
    }
  }

  // Get one LeaveType with company
  async findOne(id: number) {
    try {
      const leaveType = await this.leaveTypeRepo
        .createQueryBuilder("leave_type")
        .leftJoin("leave_type.company", "company")
        .select([
          "leave_type.id as id",
          "leave_type.leave_type as leave_type",
          "leave_type.status as status",
                       "leave_type.company_id as company_id", 
        ])
        .where("leave_type.id = :id", { id })
        .getRawOne();

      if (!leaveType)
        throw new NotFoundException(`Leave Type ID ${id} not found`);

      return leaveType;
    } catch (e) {
      throw e;
    }
  }

  // Update LeaveType
  async update(id: number, dto: UpdateLeaveTypeDto, company_id: number) {
    try {
      const leaveType = await this.leaveTypeRepo.findOne({
        where: { id, company_id },
      });
      if (!leaveType)
        throw new NotFoundException(`Leave Type ID ${id} not found`);

      if (dto.leave_type) leaveType.leave_type = dto.leave_type;

      await this.leaveTypeRepo.save(leaveType);
      const updated = await this.findAll(company_id);
      return updated;
    } catch (e) {
      throw e;
    }
  }

  // Toggle status
  async statusUpdate(id: number) {
    try {
      const dep = await this.leaveTypeRepo.findOneBy({ id });
      if (!dep) throw new NotFoundException("Leave Type not found");

      dep.status = dep.status === 0 ? 1 : 0;
      await this.leaveTypeRepo.save(dep);

      return this.findAll(dep.company_id);
    } catch (err) {
      return errorResponse("Something went wrong", err.message);
    }
  }
}
