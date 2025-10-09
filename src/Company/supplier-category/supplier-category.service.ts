import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupplierCategory } from './supplier-category.entity';
import { CreateSupplierCategoryDto } from './dto/create-supplier-category.dto';
import { UpdateSupplierCategoryDto } from './dto/update-supplier-category.dto';
import { Company } from '../companies/company.entity';
import { errorResponse, toggleStatusResponse } from "src/commonHelper/response.util";

@Injectable()
export class SupplierCategoryService {
  constructor(
    @InjectRepository(SupplierCategory)
    private readonly supplierCategoryRepo: Repository<SupplierCategory>,
    @InjectRepository(Company)
    private companyRepo: Repository<Company>,
  ) { }

  async create(dto: CreateSupplierCategoryDto, company_id: number) {
    try {
      //  Create supplier category with direct company_id assignments
      const category = this.supplierCategoryRepo.create({
        ...dto,
        company: { id: company_id } as Company
      });

      await this.supplierCategoryRepo.save(category);

      //  Optional: return all categories for this company
      const allCategories = await this.findAll(company_id);

      return allCategories;
    } catch (e) {
      return { message: e.message };
    }
  }


  async findAll(company_id: number, filterStatus?: number) {
    const status = filterStatus !== undefined ? filterStatus : 1; // default active=1
    try {
      const categories = await this.supplierCategoryRepo
        .createQueryBuilder("category")
        .leftJoin("category.company", "company")
        .select([
          "category.id as id",
          "category.category_code as category_code",
          "category.category_name as category_name",
          "category.description as description",
          "category.is_active as is_active",
          "company.company_name as company_name",
        ])
        .where("category.company_id = :company_id", { company_id })
        .andWhere("category.is_active = :status", { status })
        .orderBy("category.id", "DESC")
        .getRawMany();

      return categories;
    } catch (error) {
      return { message: error.message };
    }
  }


  async findOne(id: number) {
    try {
      const category = await this.supplierCategoryRepo
        .createQueryBuilder("category")
        .leftJoin("category.company", "company")
        .select([
          "category.id as id",
          "category.category_code as category_code",
          "category.category_name as category_name",
          "category.description as description",
          "category.is_active as is_active",
          "company.company_name as company_name",
        ])
        .where("category.id = :id", { id })
        .getRawOne();

      if (!category) throw new NotFoundException(`Supplier category ID ${id} not found`);

      return category;
    } catch (e) {
      return { message: e.message };
    }
  }

  async update(id: number, dto: UpdateSupplierCategoryDto, company_id: number) {
    try {
      const category = await this.supplierCategoryRepo.findOne({
        where: { id, is_active: 1 },
      });
      if (!category) return { success: false, message: 'Supplier category not found or inactive' };

      // if (dto.company_id) {
      //   const company = await this.companyRepo.findOne({
      //     where: { id: dto.company_id, status: 1 },
      //   });
      //   if (!company) {
      //     return { success: false, message: `Company with ID ${dto.company_id} not found or inactive` };
      //   }
      //   category.company = { id: dto.company_id } as Company;
      // }

      Object.assign(category, dto);
      await this.supplierCategoryRepo.save(category);

      const updated = await this.findAll(company_id);
      return updated;
    } catch (e) {
      return { message: e.message };
    }
  }

  async toggleStatus(id: number) {
    try {
      const category = await this.supplierCategoryRepo.findOneBy({ id });
      if (!category) throw new NotFoundException("Supplier category not found");

      // Toggle is_active between 0 and 1
      category.is_active = category.is_active === 0 ? 1 : 0;

      await this.supplierCategoryRepo.save(category);

      // Return a consistent toggle response
      return toggleStatusResponse("Supplier Category", category.is_active);
    } catch (err) {
      return errorResponse("Something went wrong", err.message);
    }
  }

}
