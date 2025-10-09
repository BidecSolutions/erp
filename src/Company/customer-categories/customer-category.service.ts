import { Injectable, NotFoundException, ParseIntPipe } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CustomerCategory } from "./customer-category.entity";
import { CreateCustomerCategoryDto } from "./dto/create-customer-category.dto";
import { UpdateCustomerCategoryDto } from "./dto/update-customer-category.dto";
import { Company } from "../companies/company.entity";
import {
  errorResponse,
  toggleStatusResponse,
} from "src/commonHelper/response.util";

@Injectable()
export class CustomerCategoryService {
  constructor(
    @InjectRepository(CustomerCategory)
    private categoryRepo: Repository<CustomerCategory>,
    @InjectRepository(Company)
    private companyRepo: Repository<Company>,
  ) { }

  async create(dto: CreateCustomerCategoryDto, companyId: any) {
    try {
      const company = await this.companyRepo.findOne({ where: { id: companyId } });
      if (!company) return { success: false, message: 'Company not found' };

      const category = this.categoryRepo.create({
        category_code: dto.category_code,
        category_name: dto.category_name,
        description: dto.description,
        discount_percent: dto.discount_percent,
        is_active: 1,
        company: companyId,
      });

      const savedCategory = await this.categoryRepo.save(category);
      return { success: true, message: 'Customer category created successfully', data: savedCategory };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to create customer category' };
    }
  }

  async findAll(company_id: number) {
    try {
      const categories = await this.categoryRepo
        .createQueryBuilder("category")
        .leftJoin("category.company", "company")
        .orderBy('category.id', 'DESC')
        .select([
          "category.id as id",
          "category.category_code as category_code",
          "category.category_name as category_name",
          "category.description as description",
          "category.discount_percent as discount_percent",
          "category.is_active as is_active",
          "company.company_name as company_name",
        ])
        .where("category.companyId = :company_id", { company_id })
        .orderBy("category.id", "DESC")
        .getRawMany();

      return categories;
    } catch (e) {
      return { message: e.message };
    }
  }

  async findOne(id: number) {
    try {
      const category = await this.categoryRepo
        .createQueryBuilder("category")
        .leftJoin("category.company", "company")
        .select([
          "category.id as id",
          "category.category_code as category_code",
          "category.category_name as category_name",
          "category.description as description",
          "category.discount_percent as discount_percent",
          "category.is_active as is_active",
          "company.company_name as company_name",
        ])
        .where("category.companyId = :id", { id })
        .getRawOne();

      if (!category)
        throw new NotFoundException(`Customer Category ID ${id} not found`);

      return category;
    } catch (e) {
      return { message: e.message };
    }
  }

  async update(id: number, dto: UpdateCustomerCategoryDto, company_id: number) {
    try {
      const category = await this.categoryRepo.findOne({
        where: { id },

      });
      if (!category)
        throw new NotFoundException(`Customer Category ID ${id} not found`);

      if (dto.category_code) category.category_code = dto.category_code;
      if (dto.category_name) category.category_name = dto.category_name;
      if (dto.description) category.description = dto.description;
      if (dto.discount_percent !== undefined)
        category.discount_percent = dto.discount_percent;

      await this.categoryRepo.save(category);

      const updatedList = await this.findAll(company_id);
      return updatedList;
    } catch (e) {
      return { message: e.message };
    }
  }

  async statusUpdate(id: number) {
    try {
      const cus = await this.categoryRepo.findOneBy({ id });
      if (!cus) throw new NotFoundException("Customer category not found");

      cus.is_active = cus.is_active === 0 ? 1 : 0;
      await this.categoryRepo.save(cus);

      return toggleStatusResponse("Customer category", cus.is_active);
    } catch (err) {
      return errorResponse("Something went wrong", err.message);
    }
  }
}
