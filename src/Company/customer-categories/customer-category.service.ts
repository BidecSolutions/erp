import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerCategory } from './customer-category.entity';
import { CreateCustomerCategoryDto } from './dto/create-customer-category.dto';
import { UpdateCustomerCategoryDto } from './dto/update-customer-category.dto';
import { Company } from '../companies/company.entity';

@Injectable()
export class CustomerCategoryService {
  constructor(
    @InjectRepository(CustomerCategory)
    private categoryRepo: Repository<CustomerCategory>,
    @InjectRepository(Company)
    private companyRepo: Repository<Company>,
  ) { }

  async create(dto: CreateCustomerCategoryDto) {
    try {
      const company = await this.companyRepo.findOne({ where: { id: dto.company_id } });
      if (!company) return { success: false, message: 'Company not found' };

      const category = this.categoryRepo.create({
        ...dto,
        company: { id: dto.company_id } as Company,
        is_active: 1,
      });

      const savedCategory = await this.categoryRepo.save(category);
      return { success: true, message: 'Customer category created successfully', data: savedCategory };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to create customer category' };
    }
  }

  async findAll() {
    try {
      const categories = await this.categoryRepo
        .createQueryBuilder('category')
        .leftJoin('category.company', 'company')
        .where('category.is_active = :isActive', { isActive: 1 })
        .orderBy('category.id', 'DESC')
        .select([
          'category.id',
          'category.category_code',
          'category.category_name',
          'category.description',
          'category.discount_percent',
          'category.is_active',
          'category.created_by',
          'category.created_date',
          'company.id',
          'company.company_name',
        ])
        .getRawMany();

      const data = categories.map(row => ({
        id: row.category_id,
        category_code: row.category_category_code,
        category_name: row.category_category_name,
        description: row.category_description,
        discount_percent: row.category_discount_percent,
        is_active: row.category_is_active,
        created_by: row.category_created_by,
        created_date: row.category_created_date,
        company: {
          id: row.company_id,
          company_name: row.company_company_name,
        },
      }));

      return { success: true, message: 'Customer categories retrieved successfully', data };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to retrieve customer categories' };
    }
  }

  async findOne(id: number) {
    try {
      const category = await this.categoryRepo.findOne({
        where: { id, is_active: 1 },
        relations: ['company'],
        select: {
        id: true,
        category_code: true,
        category_name: true,
        description: true,
        discount_percent: true,
        is_active: true,
        created_by: true,
        created_date: true,
        company: {
          id: true,
          company_name: true,
        },
      },
      });
      if (!category) return { success: false, message: `Customer category with ID ${id} not found` };
      return { success: true, message: 'Customer category retrieved successfully', data: category };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to retrieve customer category' };
    }
  }


  async update(id: number, dto: UpdateCustomerCategoryDto) {
    try {
      // fetch real entity, not raw query result
      const category = await this.categoryRepo.findOne({
        where: { id },
        relations: ['company'],
      });
      if (!category) return { success: false, message: `Customer category with ID ${id} not found` };

      if (dto.company_id) {
        const company = await this.companyRepo.findOne({ where: { id: dto.company_id } });
        if (!company) return { success: false, message: 'Company not found' };
        category.company = { id: dto.company_id } as Company; // assign real relation
      }

      Object.assign(category, dto);

      const updatedCategory = await this.categoryRepo.save(category);

      return {
        success: true,
        message: 'Customer category updated successfully',
        data: updatedCategory,
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to update customer category' };
    }
  }


  async softDelete(id: number) {
    try {
      const categoryRes = await this.findOne(id);
      if (!categoryRes.success) return categoryRes;

      const category = categoryRes.data;
      if (!category) {
        return { success: false, message: 'Customer category not found for soft delete' };
      }
      category.is_active = 2; // soft delete
      await this.categoryRepo.save(category);

      return { success: true, message: `Customer category with ID ${id} set to inactive`, data: category };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to soft delete customer category' };
    }
  }
}
