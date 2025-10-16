import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateWarrantyDto } from "./dto/create-warranty.dto";
import { UpdateWarrantyDto } from "./dto/update-warranty.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Warranty } from "./entities/warranty.entity";
import { Repository } from "typeorm";
import {
  errorResponse,
  successResponse,
  toggleStatusResponse,
} from "src/commonHelper/response.util";

@Injectable()
export class WarrantyService {
  constructor(
    @InjectRepository(Warranty)
    private readonly repo: Repository<Warranty>
  ) {}

  async create(dto: CreateWarrantyDto, userId: number, companyId: number) {
    try {
      const warranty = this.repo.create({
        ...dto,
        company_id: companyId,
        created_by: userId,
      });
      await this.repo.save(warranty);
      return successResponse("warranty created successfully!", warranty);
    } catch (error) {
      throw new BadRequestException(
        error.message || "Failed to create warranty"
      );
    }
  }
  async findAll(company_id: number,filter?: number, ) {
    try {
      const where: any = { };
      if (filter !== undefined) {
        where.status = filter; // filter apply
      }
   const [warranty, total] = await this.repo
  .createQueryBuilder('warranty')
  .select([
    'warranty.id',
    'warranty.warranty_type',
    'warranty.duration',
    'warranty.status',
    'warranty.company_id',
    'warranty.created_at',
    'warranty.updated_at',
    'warranty.created_by',
    'warranty.updated_by',
  ])
  .where('warranty.company_id = :company_id', { company_id })
  .getManyAndCount();
      return successResponse("warranty retrieved successfully!", {
        total_record: total,
        warranty,
      });
    } catch (error) {
      return errorResponse("Failed to retrieve warranty", error.message);
    }
  }

 async findOne(id: number, company_id: number) {
  try {
    const warranty = await this.repo
      .createQueryBuilder('warranty')
      .select([
        'warranty.id',
        'warranty.warranty_type',
        'warranty.duration',
        'warranty.status',
        'warranty.company_id',
        'warranty.created_at',
        'warranty.updated_at',
        'warranty.created_by',
        'warranty.updated_by',
      ])
      .where('warranty.id = :id', { id })
      .andWhere('warranty.company_id = :company_id', { company_id })
      .getOne();

    if (!warranty) {
      return errorResponse(`Warranty #${id} not found`);
    }

    return successResponse('Warranty retrieved successfully!', warranty);
  } catch (error) {
    return errorResponse('Failed to retrieve warranty', error.message);
  }
}


  async update(id: number, updateDto: UpdateWarrantyDto,userId:number,  company_id: number) {
    try {
      const existing = await this.repo.findOne({ where: { id,company_id } });
      if (!existing) {
        return errorResponse(`warranty #${id} not found`);
      }

     const updated = await this.repo.save({
         id,
          ...updateDto,
       company_id,
      created_by: userId,
      updated_by: userId,
      
        });
      return successResponse("Warranty updated successfully!", updated);
  } catch (e) {
    return errorResponse(e.message);
  }
}

  async statusUpdate(id: number) {
    try {
      const warranty = await this.repo.findOne({ where: { id } });
      if (!warranty) throw new NotFoundException("warranty not found");

      warranty.status = warranty.status === 0 ? 1 : 0;
      const saved = await this.repo.save(warranty);

      return toggleStatusResponse("warranty", saved.status);
    } catch (err) {
      return errorResponse("Something went wrong", err.message);
    }
  }
}
