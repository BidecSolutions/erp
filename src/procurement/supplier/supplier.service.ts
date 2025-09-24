import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { errorResponse, successResponse } from 'src/commonHelper/response.util';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { Repository } from 'typeorm';
// import { toggleEntityStatus } from 'src/commonHelper/toggleStaus.util';

@Injectable()
export class SupplierService {

    constructor(
      @InjectRepository(Supplier)
      private readonly supplierRepo: Repository<Supplier>,
    ) {}
   async create(createDto: CreateSupplierDto) {
  try {
    const supplier = this.supplierRepo.create(createDto);
    await this.supplierRepo.save(supplier);

    return successResponse('Supplier created successfully!', supplier);
    
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new BadRequestException('Email already exists');
    }

    // baki errors ko normal exception ke sath throw karo
    throw new BadRequestException(error.message || 'Failed to create supplier');
  }
}

async findAll(filter?: number) {
  try {
    const where: any = {};
    if (filter !== undefined) {
      where.status = filter; // filter apply
    }

    const [suppliers, total] = await this.supplierRepo.findAndCount({
      where,
      // relations: ['tax'],
    });

    const data = suppliers.map((sup) => ({
      ...sup,
      // tax: sup.tax?.tax_type,
    }));

    return successResponse('Suppliers retrieved successfully!', {
      total_record: total,
      data,
    });
  } catch (error) {
    return errorResponse('Failed to retrieve supplier', error.message);
  }
}

async findOne(id: number) {
  try {
    const supplier = await this.supplierRepo.findOneBy({ id });
    if (!supplier) {
      return errorResponse(`Suppliers #${id} not found`);
    }

    return successResponse('Suppliers retrieved successfully!', supplier);
  } catch (error) {
    return errorResponse('Failed to retrieve supplier', error.message);
  }
}

async update(id: number, updateDto: UpdateSupplierDto) {
  try {
    const existing = await this.supplierRepo.findOne({ where: { id } });
    if (!existing) {
      return errorResponse(`Suppliers #${id} not found`);
    }

    const supplier = await this.supplierRepo.save({ id, ...updateDto });
    return successResponse('Suppliers updated successfully!', supplier);
  } catch (error) {
    return errorResponse('Failed to update supplier', error.message);
  }
}

  async remove(id: number) {
    const result = await this.supplierRepo.update(id, { status: 0 });

    if (result.affected === 0) {
      throw new NotFoundException(`doctor #${id} not found`);
    }
    return {
      success: true,
      message: 'doctor  deleted successfully!',
    };
  }

 
}
