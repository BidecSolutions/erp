import { Injectable, NotFoundException } from "@nestjs/common";
import { Department } from "./department.entity";
import { UpdateDepartmentDto } from "./dto/update-department.dto";
import { Repository } from "typeorm";
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

  async create(dto: CreateDepartmentDto): Promise<any> {
    const company = await this.companyRepo.findOneBy({ id: dto.company_id });
    if (!company) throw new NotFoundException("Company not found");

    const department = this.departmentRepository.create({
      name: dto.name,
      company_id: company.id,
    });

    const savedDept = await this.departmentRepository.save(department);

    return {
      id: savedDept.id,
      name: savedDept.name,
      company: company.company_name, // sirf name
      status: savedDept.status,
    };
  }

  async findAll(filterStatus?: number) {
    const status = filterStatus !== undefined ? filterStatus : 1;
    const departments = await this.departmentRepository.find({
      where: {status},
      relations: ["company"],
    });
    return departments.map((d) => ({
      id: d.id,
      name: d.name,
      company: d.company?.company_name, // sirf name
      status: d.status,
    }));
  }

  async findOne(id: number): Promise<any> {
    const department = await this.departmentRepository.findOne({
      where: { id },
      relations: ["company"],
    });
    if (!department)
      throw new NotFoundException(`Department with ID ${id} not found`);

    return {
      id: department.id,
      name: department.name,
      company: department.company?.company_name, // sirf name
      status: department.status,
    };
  }

  async update(id: number, dto: UpdateDepartmentDto): Promise<any> {
    const department = await this.departmentRepository.findOneBy({ id });
    if (!department)
      throw new NotFoundException(`Department with ID ${id} not found`);

    if (dto.name) department.name = dto.name;

    if (dto.company_Id) {
      const company = await this.companyRepo.findOneBy({ id: dto.company_Id });
      if (!company) throw new NotFoundException("Company not found");
      department.company = company; // relation assign
    }

    const updatedDept = await this.departmentRepository.save(department);

    return {
      id: updatedDept.id,
      name: updatedDept.name,
      company: updatedDept.company?.company_name,
      status: updatedDept.status,
    };
  }

  async remove(id: number): Promise<{ message: string }> {
    const department = await this.departmentRepository.findOne({
      where: { id },
      relations: ["company"],
    });
    if (!department)
      throw new NotFoundException(`Department with ID ${id} not found`);

    await this.departmentRepository.remove(department);

    return { message: `Department with ID ${id} deleted successfully` };
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
