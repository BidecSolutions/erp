import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupplierCategory } from './supplier-category.entity';
import { CreateSupplierCategoryDto } from './dto/create-supplier-category.dto';
import { UpdateSupplierCategoryDto } from './dto/update-supplier-category.dto';
import { Company } from '../companies/company.entity';

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
    //  Create supplier category with direct company_id assignment
    const category = this.supplierCategoryRepo.create({
      ...dto,
      company_id, // assign directly like allowance
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
        "category.id",
        "category.category_code",
        "category.category_name",
        "category.description",
        "category.is_active",
        "company.company_name",
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
        "category.id",
        "category.category_code",
        "category.category_name",
        "category.description",
        "category.is_active",
        "company.company_name",
      ])
      .where("category.id = :id", { id })
      .getRawOne();

    if (!category) throw new NotFoundException(`Supplier category ID ${id} not found`);

    return category;
  } catch (e) {
    return { message: e.message };
  }
}

  async update(id: number, dto: UpdateSupplierCategoryDto, company_id:number) {
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

  async remove(id: number) {
    try {
      const category = await this.supplierCategoryRepo.findOne({
        where: { id, is_active: 1 },
      });
      if (!category) return { success: false, message: 'Supplier category not found or already inactive' };

      category.is_active = 2;
      await this.supplierCategoryRepo.save(category);

      return { success: true, message: 'Supplier category deleted successfully (soft delete)', data: category };
    } catch (error) {
      return { success: false, message: 'Failed to delete supplier category', error };
    }
  }
}
