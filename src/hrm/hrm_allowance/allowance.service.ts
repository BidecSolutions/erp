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

    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {}

  //  Create allowance with company
  async create(dto: CreateAllowanceDto) {
    const company = await this.companyRepo.findOneBy({ id: dto.company_id });
    if (!company) throw new NotFoundException('Company not found');

    const newAllowance = this.allowanceRepo.create({
      title: dto.title,
      type: dto.type,
      amount: dto.amount,
      company,
    });

    const saved = await this.allowanceRepo.save(newAllowance);

    return {
      id: saved.id,
      title: saved.title,
      type: saved.type,
      amount: saved.amount,
      company: saved.company?.company_name,
    };
  }

  //  Get all allowances with company name
  async findAll(filterStatus?: number) {
                    const status = filterStatus !== undefined ? filterStatus : 1;
    const allowances = await this.allowanceRepo.find({ where: {status}, relations: ['company'] });
    return allowances.map(a => ({
      id: a.id,
      title: a.title,
      type: a.type,
      amount: a.amount,
      company: a.company?.company_name,
      status: a.status,
    }));
  }

  //  Get single allowance by id with company
  async findOne(id: number) {
    const a = await this.allowanceRepo.findOne({ where: { id }, relations: ['company'] });
    if (!a) throw new NotFoundException(`Allowance ID ${id} not found`);

    return {
      id: a.id,
      title: a.title,
      type: a.type,
      amount: a.amount,
      company: a.company?.company_name,
    };
  }

  //  Update allowance including company
  async update(id: number, dto: UpdateAllowanceDto) {
    const allowance = await this.allowanceRepo.findOne({ where: { id }, relations: ['company'] });
    if (!allowance) throw new NotFoundException(`Allowance ID ${id} not found`);

    if (dto.company_id) {
      const company = await this.companyRepo.findOneBy({ id: dto.company_id });
      if (!company) throw new NotFoundException('Company not found');
      allowance.company = company;
    }

    Object.assign(allowance, dto);
    const saved = await this.allowanceRepo.save(allowance);

    return {
      id: saved.id,
      title: saved.title,
      type: saved.type,
      amount: saved.amount,
      company: saved.company?.company_name,
    };
  }

  //  Delete allowance
  async remove(id: number) {
    const allowance = await this.allowanceRepo.findOneBy({ id });
    if (!allowance) throw new NotFoundException(`Allowance ID ${id} not found`);
    await this.allowanceRepo.remove(allowance);
    return { message: `Allowance ID ${id} deleted successfully` };
  }

       async statusUpdate(id: number) {
            try {
              const dep = await this.allowanceRepo.findOneBy({ id });
              if (!dep) throw new NotFoundException("Allowance not found");
        
              dep.status = dep.status === 0 ? 1 : 0;
              await this.allowanceRepo.save(dep);
        
              return toggleStatusResponse("Allowance", dep.status);
            } catch (err) {
              return errorResponse("Something went wrong", err.message);
            }
          }
}
