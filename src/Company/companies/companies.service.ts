import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../companies/company.entity';
import { CreateCompanyDto } from '../companies/dto/create-company.dto';
import { UpdateCompanyDto } from '../companies/dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companyRepo: Repository<Company>,
  ) { }

  async create(dto: CreateCompanyDto) {
    try {
      const company = this.companyRepo.create(dto);
      const savedCompany = await this.companyRepo.save(company);
      return { success: true, message: 'Company created successfully', data: savedCompany };
    } catch (error) {
      return { success: false, message: 'Failed to create company' };
    }
  }

  async findAll(): Promise<{ success: boolean; message: string; data?: Company[] }> {
    try {
      const companies = await this.companyRepo.find({ where: { status: 1 }, order: { id: 'DESC' } });
      return { success: true, message: 'Active companies retrieved successfully', data: companies };
    } catch (error) {
      return { success: false, message: 'Failed to retrieve companies' };
    }
  }

  async findOne(id: number): Promise<{ success: boolean; message: string; data?: Company }> {
    try {
      const company = await this.companyRepo.findOne({ where: { id, status: 1 } });
      if (!company) return { success: false, message: `Company with ID ${id} not found or inactive` };
      return { success: true, message: 'Company retrieved successfully', data: company };
    } catch (error) {
      return { success: false, message: 'Failed to retrieve company' };
    }
  }

  async update(id: number, dto: UpdateCompanyDto): Promise<{ success: boolean; message: string; data?: Company }> {
    try {
      const company = await this.companyRepo.findOne({ where: { id } });
      if (!company) return { success: false, message: `Company with ID ${id} not found` };

      Object.assign(company, dto);
      const updatedCompany = await this.companyRepo.save(company);
      return { success: true, message: 'Company updated successfully', data: updatedCompany };
    } catch (error) {
      return { success: false, message: 'Failed to update company' };
    }
  }

  //   async softDelete(id: number): Promise<{ success: boolean; message: string; data?: null }> {
  //     try {
  //       const company = await this.companyRepo.findOne({ where: { id } });
  //       if (!company) return { success: false, message: `Company with ID ${id} not found` };

  //       company.status = 2; // set inactive
  //       await this.companyRepo.save(company);
  //       return { success: true, message: `Company with ID ${id} set to inactive`, data: null };
  //     } catch (error) {
  //       return { success: false, message: 'Failed to set company as inactive' };
  //     }
  //   }
}
