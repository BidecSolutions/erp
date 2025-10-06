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
    private categoryRepo: Repository<CustomerCategory>
    // @InjectRepository(Company)
    // private companyRepo: Repository<Company>,
  ) {}

  // ✅ Create Customer Category (same style as Allowance)
  async create(dto: CreateCustomerCategoryDto, company_id: number) {
    try {
      const category = this.categoryRepo.create({
        category_code: dto.category_code,
        category_name: dto.category_name,
        description: dto.description,
        discount_percent: dto.discount_percent,
        is_active: 1,
        company_id,
      });

      await this.categoryRepo.save(category);

      const saved = await this.findAll(company_id);
      return saved;
    } catch (e) {
      return { message: e.message };
    }
  }

  async findAll(company_id: number, filterStatus?: number) {
    const is_active = filterStatus !== undefined ? filterStatus : 1; // default active=1
    try {
      const categories = await this.categoryRepo
        .createQueryBuilder("category")
        .leftJoin("category.company", "company")
        .select([
          "category.id",
          "category.category_code",
          "category.category_name",
          "category.description",
          "category.discount_percent",
          "category.is_active",
          "company.company_name",
        ])
        .where("category.company_id = :company_id", { company_id })
        .andWhere("category.is_active = :is_active", { is_active })
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
          "category.id",
          "category.category_code",
          "category.category_name",
          "category.description",
          "category.discount_percent",
          "category.is_active",
          "company.company_name",
        ])
        .where("category.id = :id", { id })
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
        where: { id, company_id },
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
