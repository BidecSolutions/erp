import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./entities/category.entity";
import { Repository } from "typeorm";
import {
  errorResponse,
  successResponse,
  toggleStatusResponse,
} from "src/commonHelper/response.util";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>
  ) {}
  async create(createDto: CreateCategoryDto, company_id: number) {
    try {
      const category = this.repo.create({ ...createDto, company_id });
      await this.repo.save(category);
      const categories = await this.findAll(company_id);
      return categories;
    } catch (e) {
      if (e.code === "ER_DUP_ENTRY") {
        throw new BadRequestException("category already exists");
      }
      return { message: e.message };
    }
  }
  
  async findAll(company_id: number, filterStatus?: number) {
    const status = filterStatus !== undefined ? filterStatus : 1; // default active
    try {
      const categories = await this.repo
        .createQueryBuilder("category")
        .leftJoin("category.company", "company")
        .select([
          "category.id",
          "category.category_code",
          "category.category_name",
          "category.description",
          "category.status",
          "company.company_name",
        ])
        .where("category.company_id = :company_id", { company_id })
        .andWhere("category.status = :status", { status })
        .orderBy("category.id", "DESC")
        .getRawMany();

      return categories;
    } catch (error) {
      return { message: error.message };
    }
  }

  async findOne(id: number) {
    try {
      const category = await this.repo
        .createQueryBuilder("category")
        .leftJoin("category.company", "company")
        .select([
          "category.id",
          "category.category_code",
          "category.category_name",
          "category.description",
          "category.status",
          "company.company_name",
        ])
        .where("category.id = :id", { id })
        .getRawOne();

      if (!category) {
        throw new NotFoundException(`category ID ${id} not found`);
      }

      return category;
    } catch (error) {
      return { message: error.message };
    }
  }

  async update(id: number, updateDto: UpdateCategoryDto, company_id: number) {
    try {
      const existing = await this.repo.findOne({ where: { id, company_id } });
      if (!existing) {
        return errorResponse(`category #${id} not found`);
      }

      await this.repo.save({ id, ...updateDto });
      const updated = await this.findAll(company_id);
      return updated;
    } catch (e) {
      return { message: e.message };
    }
  }
  async statusUpdate(id: number) {
    try {
      const category = await this.repo.findOne({ where: { id } });
      if (!category) throw new NotFoundException("category not found");

      category.status = category.status === 0 ? 1 : 0;
      const saved = await this.repo.save(category);

      return toggleStatusResponse("category", saved.status);
    } catch (err) {
      return errorResponse("Something went wrong", err.message);
    }
  }
}
