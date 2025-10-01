import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../companies/company.entity';
import { CreateCompanyDto } from '../companies/dto/create-company.dto';
import { UpdateCompanyDto } from '../companies/dto/update-company.dto';
import { userCompanyMapping } from 'src/entities/user-company-mapping.entity';
import { User } from 'src/entities/user.entity';
import { userRoleMapping } from 'src/entities/user-role-mapping.entity';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companyRepo: Repository<Company>,

    @InjectRepository(userCompanyMapping)
    private ucm: Repository<userCompanyMapping>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(userRoleMapping)
    private userRoleMappingRepo: Repository<userRoleMapping>,

  ) { }

  async create(dto: CreateCompanyDto) {
    try {
      //company add
      const company = this.companyRepo.create(dto);
      const savedCompany = await this.companyRepo.save(company);

      //user add
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const userObject = this.userRepo.create({
        name: dto.company_name,
        email: dto.email,
        password: hashedPassword,
      })
      const saveUser = await this.userRepo.save(userObject);

      //user role add
      const userRoleMapping = this.userRoleMappingRepo.create({
        user_id: saveUser.id,
        roll_id: 2
      });

      await this.userRoleMappingRepo.save(userRoleMapping);


      //user company Mapping
      const userMapping = this.ucm.create({
        user_id: saveUser.id,
        company_id: savedCompany.id,
        branch_id: []
      });

      await this.ucm.save(userMapping);
      return { success: true, message: 'Company created successfully', data: savedCompany };
    }
    catch (error) {
      return { success: false, message: error.message };
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
