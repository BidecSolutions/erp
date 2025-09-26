import { Injectable } from '@nestjs/common';
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

  async create(dto: CreateSupplierCategoryDto,) {
    try {
      const company = await this.companyRepo.findOne({
        where: { id: dto.company_id, status: 1 },
      });
      if (!company) {
        return { success: false, message: `Company with ID ${dto.company_id} not found or inactive` };
      }

      const category = this.supplierCategoryRepo.create({
        ...dto,
        company: { id: dto.company_id } as Company,
      });

      const saved = await this.supplierCategoryRepo.save(category);
      return { success: true, message: 'Supplier category created successfully', data: saved };
    } catch (error) {
      return { success: false, message: 'Failed to create supplier category', error };
    }
  }

  async findAll() {
    try {
      const categories = await this.supplierCategoryRepo.find({
        relations: ['company'],
        where: { is_active: 1 },
        order: { id: 'DESC' },
        select: {
          id: true,
          category_code: true,
          category_name: true,
          description: true,
          is_active: true,
          // created_by: true,
          // created_date: true,
          company: {
            id: true,
            company_name: true,
          },
        },
      });
      return { success: true, data: categories };
    } catch (error) {
      return { success: false, message: 'Failed to fetch supplier categories', error };
    }
  }

  async findOne(id: number) {
    try {
      const category = await this.supplierCategoryRepo.findOne({
        where: { id, is_active: 1 },
        relations: ['company'],
        select: {
          id: true,
          category_code: true,
          category_name: true,
          description: true,
          is_active: true,
          // created_by: true,
          // created_date: true,
          company: {
            id: true,
            company_name: true,
          },
        },
      });

      if (!category) return { success: false, message: `Supplier category with ID ${id} not found` };

      return { success: true, data: category };
    } catch (error) {
      return { success: false, message: 'Failed to fetch supplier category', error };
    }
  }

  async update(id: number, dto: UpdateSupplierCategoryDto) {
    try {
      const category = await this.supplierCategoryRepo.findOne({
        where: { id, is_active: 1 },
      });
      if (!category) return { success: false, message: 'Supplier category not found or inactive' };

      if (dto.company_id) {
        const company = await this.companyRepo.findOne({
          where: { id: dto.company_id, status: 1 },
        });
        if (!company) {
          return { success: false, message: `Company with ID ${dto.company_id} not found or inactive` };
        }
        category.company = { id: dto.company_id } as Company;
      }

      Object.assign(category, dto);
      const updated = await this.supplierCategoryRepo.save(category);

      return { success: true, message: 'Supplier category updated successfully', data: updated };
    } catch (error) {
      return { success: false, message: 'Failed to update supplier category', error };
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
