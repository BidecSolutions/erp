import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { NotificationType } from "./notification-type.entity";
import { CreateNotificationTypeDto } from "./dto/create-notification-type.dto";
import { UpdateNotificationTypeDto } from "./dto/update-notification-type.dto";
import { Company } from "src/Company/companies/company.entity";
import {
  errorResponse,
  toggleStatusResponse,
} from "src/commonHelper/response.util";

@Injectable()
export class NotificationTypeService {
  constructor(
    @InjectRepository(NotificationType)
    private repo: Repository<NotificationType>,

    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>
  ) {}

  // Create notification type with company_id
  async create(dto: CreateNotificationTypeDto, company_id: number) {
    try {
      const notificationType = this.repo.create({
        ...dto,
        company_id,
      });

      await this.repo.save(notificationType);
      const saved = await this.findAll(company_id);
      return saved;
    } catch (e) {
      throw e;
    }
  }

  // Get all notification types for a company
  async findAll(company_id: number, filterStatus?: number) {
    const status = filterStatus !== undefined ? filterStatus : 1;
    try {
      const types = await this.repo
        .createQueryBuilder("notification_type")
        .leftJoin("notification_type.company", "company")
        .select([
          "notification_type.id as id",
          "notification_type.type as type",
          "notification_type.status as status",
          "company.company_name as company_name",
        ])
        .where("notification_type.company_id = :company_id", { company_id })
        .andWhere("notification_type.status = :status", { status })
        .orderBy("notification_type.id", "DESC")
        .getRawMany();

      return types;
    } catch (e) {
      throw e;
    }
  }

  // Get single notification type by ID
  async findOne(id: number) {
    try {
      const type = await this.repo
        .createQueryBuilder("notification_type")
        .leftJoin("notification_type.company", "company")
        .select([
          "notification_type.id as id",
          "notification_type.type as type",
          "notification_type.status as status",
          "company.company_name as company_name",
        ])
        .where("notification_type.id = :id", { id })
        .getRawOne();

      if (!type)
        throw new NotFoundException(`Notification Type ID ${id} not found`);
      return type;
    } catch (e) {
      throw e;
    }
  }

  // Update notification type
  async update(id: number, dto: UpdateNotificationTypeDto, company_id: number) {
    try {
      const record = await this.repo.findOne({ where: { id, company_id } });
      if (!record)
        throw new NotFoundException(`Notification Type ID ${id} not found`);

      Object.assign(record, dto);
      await this.repo.save(record);

      const updated = await this.findAll(company_id);
      return updated;
    } catch (e) {
      throw e;
    }
  }

  // Toggle status
  async statusUpdate(id: number) {
    try {
      const dep = await this.repo.findOneBy({ id });
      if (!dep) throw new NotFoundException("Notification Type not found");

      dep.status = dep.status === 0 ? 1 : 0;
      await this.repo.save(dep);

      return toggleStatusResponse("Notification Type", dep.status);
    } catch (err) {
      return errorResponse("Something went wrong", err.message);
    }
  }
}
