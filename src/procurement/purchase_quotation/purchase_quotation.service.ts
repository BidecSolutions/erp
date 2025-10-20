// purchase-quotation.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Not } from 'typeorm';
import { PurchaseQuotation } from './entities/purchase_quotation.entity';
import { Supplier } from 'src/Company/supplier/supplier.entity';
import { CreatePurchaseQuotationDto } from './dto/create-purchase_quotation.dto';
import { errorResponse, successResponse, toggleStatusResponse } from 'src/commonHelper/response.util';
import { QuotationItem } from './entities/purchase_quotation_item.entity';
import { PurchaseQuotationStatus } from '../enums/purchase-quatation.enum';
import { PurchaseRequest } from '../purchase_request/entities/purchase_request.entity';
import { UpdatePurchaseQuatiationDto } from './dto/update-purchase_quotation.dto';
import { PurchaseRequestItem } from '../purchase_request/entities/purchase-request-item.entity';


@Injectable()
export class PurchaseQuotationService {
  constructor(
    @InjectRepository(PurchaseQuotation)
    private readonly quotationRepo: Repository<PurchaseQuotation>,
    @InjectRepository(QuotationItem)
    private readonly quotationItemRepo: Repository<QuotationItem>,
    @InjectRepository(Supplier)
    private readonly supplierRepo: Repository<Supplier>,
    @InjectRepository(PurchaseRequest)
    private readonly prRepo: Repository<PurchaseRequest>,
    private readonly dataSource: DataSource,
  ) { }
  async store(createDto: CreatePurchaseQuotationDto ,userId:number , companyId:number ) {
  try {
    // const pr = await this.prRepo.findOneBy({ id: createDto.purchase_request_id });
    // if (!pr) {
    //   return errorResponse(`Purchase Request #${createDto.purchase_request_id} not found`);
    // }
    // if ((pr.pr_status ?? '').toLowerCase().trim() !== 'approved') {
    //   return errorResponse("Can't create purchase quotation, purchase request still pending");
    // }

 
      const savedQuotations: PurchaseQuotation[] = [];
      const prItems = await this.prRepo.find({
        where: { id: createDto.purchase_request_id },
        order: { id: 'ASC' },
      });

      if (!prItems || prItems.length === 0) {
        throw new BadRequestException(
          `No items found for Purchase Request #${createDto.purchase_request_id}`,
        );
      }
      for (const supplierQuotation of createDto.suppliers) {
        const supplier = await this.supplierRepo.findOne({
          where: { id: supplierQuotation.supplier_id },
        });
        if (!supplier) {
          throw new BadRequestException(
            `Supplier ${supplierQuotation.supplier_id} not found`,
          );
        }
        const quotation = this.quotationRepo.create({
          purchase_request_id: createDto.purchase_request_id,
          supplier_id: supplier.id, 
          company_id:companyId,
          user_id:userId,
          branch_id: createDto.branch_id,
        });
        const savedQuotation = await this.quotationRepo.save(quotation);

        if (supplierQuotation.items && supplierQuotation.items.length > 0) {
          // if (supplierQuotation.items.length !== prItems.length) {
          //   throw new BadRequestException(
          //     `Supplier ${supplier.id} items count (${supplierQuotation.items.length}) does not match PR items count (${prItems.length})`
          //   );
          // }
          const quotationItems = supplierQuotation.items.map(
            (item, index) => {
              const prItem = prItems[index];
              return this.quotationItemRepo.create({
                product_id: item.product_id,
                variant_id: item.variant_id,
                quantity: item.quantity,
                unit_price: item.unit_price,
                delivery_days: item.delivery_days,
                purchase_quotation_id: savedQuotation.id,
                supplier_id: savedQuotation.supplier_id,
              });
            },
          );

          await this.quotationItemRepo.save(quotationItems);
        }
        savedQuotations.push(savedQuotation);
      }
      return successResponse(
        'Purchase quotations created successfully!',
        savedQuotations,
      );
    
  } catch (error) {
    throw new BadRequestException(error.message || 'Failed to save quotations');
  }
}

  async findAll(filter?: number) {
    try {
      const where: any = {};
      if (filter !== undefined) {
        where.status = filter; // filter apply
      }
      const [purchase_quotation, total] = await this.quotationRepo.findAndCount({
        where,
      });
      return successResponse('purchase quotation retrieved successfully!', {
        total_record: total,
        purchase_quotation,
      });
    } catch (error) {
      return errorResponse('Failed to retrieve purchase quotation', error.message);
    }
  }
  async findOne(id: number) {
    try {
      const purchase_quotation = await this.quotationRepo.findOneBy({ id });
      if (!purchase_quotation) {
        return errorResponse(`purchase quotation #${id} not found`);
      }

      return successResponse('purchase quotation retrieved successfully!', purchase_quotation);
    } catch (error) {
      return errorResponse('Failed to retrieve purchase_quotation', error.message);
    }
  }
  async update(id: number, updateDto: UpdatePurchaseQuatiationDto) {
    try {
      const existing = await this.quotationRepo.findOne({ where: { id } });
      if (!existing) {
        return errorResponse(`purchase quotation #${id} not found`);
      }

      const purchase_quotation = await this.quotationRepo.save({ id, ...updateDto });
      return successResponse('purchase quotation updated successfully!', purchase_quotation);
    } catch (error) {
      return errorResponse('Failed to update purchase_quotation', error.message);
    }
  } // working
  async statusUpdate(id: number) {
    try {
      const purchase_quotation = await this.quotationRepo.findOne({ where: { id } });
      if (!purchase_quotation) throw new NotFoundException('purchase quotation not found');

      purchase_quotation.status = purchase_quotation.status === 0 ? 1 : 0;
      const saved = await this.quotationRepo.save(purchase_quotation);

      return toggleStatusResponse('purchase quotation', saved.status);
    } catch (err) {
      return errorResponse('Something went wrong', err.message);
    }
  }
  async approveSupplier(id: number, supplier_id: number ,userId :number) {
    const existing = await this.quotationRepo.findOne({ where: { id } });
    if (!existing) {
      return errorResponse(`purchase quotation #${id} not found`);
    }
    const purchase_quotation = await this.quotationRepo.save({
      ...existing,
      pq_status: PurchaseQuotationStatus.APPROVED,
      approved_by :userId

    });
    return successResponse(
      `Supplier ${supplier_id} approved`,
    );
  }

}
