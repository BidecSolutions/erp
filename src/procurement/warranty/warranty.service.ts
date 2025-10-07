import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWarrantyDto } from './dto/create-warranty.dto';
import { UpdateWarrantyDto } from './dto/update-warranty.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Warranty } from './entities/warranty.entity';
import { Repository } from 'typeorm';
import { errorResponse, successResponse, toggleStatusResponse } from 'src/commonHelper/response.util';

@Injectable()
export class WarrantyService {
constructor(
      @InjectRepository(Warranty)
    private readonly repo: Repository<Warranty>) {}
    
  async store(createDto: CreateWarrantyDto, company_id:number) {
      try {
        const warranty = this.repo.create({...createDto, company_id});
        await this.repo.save(warranty);
         const saved = await this.findAll(company_id);
        return saved;
        } catch (e) {
      return { message: e.message };
    }
    }

    async findAll(company_id: number, filterStatus?: number) {
  const status = filterStatus !== undefined ? filterStatus : 1; // default active
  try {
    const warranty = await this.repo
      .createQueryBuilder("warranty")
      .leftJoin("warranty.company", "company")
      .select([
        "warranty.id",
        "warranty.warranty_type",
        "warranty.duration",
        "warranty.status",
        "company.company_name",
      ])
      .where("warranty.company_id = :company_id", { company_id })
      .andWhere("warranty.status = :status", { status })
      .orderBy("warranty.id", "DESC")
      .getRawMany();

     return {total_record: warranty.length, warranty: warranty,}
  } catch (error) {
    return { message: error.message };
  }
}

async findOne(id: number) {
  try {
    const warranty = await this.repo
      .createQueryBuilder("warranty")
      .leftJoin("warranty.company", "company")
      .select([
        "warranty.id",
        "warranty.warranty_type",      
        "warranty.duration",
        "warranty.status",
        "company.company_name",
      ])
      .where("warranty.id = :id", { id })
      .getRawOne();

    if (!warranty) {
      throw new NotFoundException(`Warranty ID ${id} not found`);
    }

    return warranty;
  } catch (error) {
    return { message: error.message };
  }
}


  // async findAll(filter?: number) {
  //     try {
  //       const where: any = {};
  //       if (filter !== undefined) {
  //         where.status = filter; // filter apply
  //       }
  //       const [warranty, total] = await this.repo.findAndCount({
  //         where,
  //       });
  //       return successResponse('warranty retrieved successfully!', {
  //         total_record: total,
  //         warranty,
  //       });
  //     } catch (error) {
  //       return errorResponse('Failed to retrieve warranty', error.message);
  //     }
  //   }
  // async findOne(id: number) {
  //     try {
  //       const warranty = await this.repo.findOneBy({ id });
  //       if (!warranty) {
  //         return errorResponse(`warranty #${id} not found`);
  //       }
    
  //       return successResponse('warranty retrieved successfully!', warranty);
  //     } catch (error) {
  //       return errorResponse('Failed to retrieve warranty', error.message);
  //     }
  //   }


  async update(id: number, updateDto: UpdateWarrantyDto, company_id: number) {
      try {
        const existing = await this.repo.findOne({ where: { id, company_id} });
        if (!existing) {
          return errorResponse(`warranty #${id} not found`);
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
    const warranty = await this.repo.findOne({ where: { id } });
    if (!warranty) throw new NotFoundException('warranty not found');

    warranty.status = warranty.status === 0 ? 1 : 0;
    const saved = await this.repo.save(warranty);

    return toggleStatusResponse('warranty', saved.status);
  } catch (err) {
    return errorResponse('Something went wrong', err.message);
  }
    }
}
