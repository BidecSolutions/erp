import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePurchaseRequestDto } from './dto/create-purchase_request.dto';
import { UpdatePurchaseRequestDto } from './dto/update-purchase_request.dto';
import { PurchaseRequest } from './entities/purchase_request.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { errorResponse, getActiveList, successResponse, toggleStatusResponse } from 'src/commonHelper/response.util';
import { PurchaseRequestItem } from './entities/purchase-request-item.entity';
import { PurchaseRequestStatus } from '../enums/purchase-request.enum';
import { ModuleType } from '../module_type/entities/module_type.entity';

@Injectable()
export class PurchaseRequestService {

  constructor(
    @InjectRepository(PurchaseRequest)
    private readonly prRepo: Repository<PurchaseRequest>,
    @InjectRepository(PurchaseRequestItem)
    private readonly pr_itemsRepo: Repository<PurchaseRequestItem>,
    @InjectRepository(ModuleType)
    private readonly moduleTypeRepo: Repository<ModuleType>,
    private readonly dataSource: DataSource,
  ) { }
  async create() {
    try {
      const module_types = await getActiveList(this.moduleTypeRepo, 'module_type');
      return successResponse('data fetched successfully', {
        module_types
      });
    } catch (error) {
      return errorResponse('Failed to load masters', error.message);
    }
  }
  async store(createDto: CreatePurchaseRequestDto) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const purchaseRequest = manager.getRepository(PurchaseRequest).create(createDto);
        const savedPurchaseRequest = await manager.getRepository(PurchaseRequest).save(purchaseRequest);
        let savedItems: PurchaseRequestItem[] = [];

        // Save Items
        if (createDto.items && createDto.items.length > 0) {
          const purchaseRequestItems = createDto.items.map((item) =>
            manager.getRepository(PurchaseRequestItem).create({
              ...item,
              purchase_request: savedPurchaseRequest,
              company_id: savedPurchaseRequest.company_id,
              branch_id: savedPurchaseRequest.branch_id,
            }),
          );
          await manager.getRepository(PurchaseRequestItem).save(purchaseRequestItems);
          savedItems = await manager.getRepository(PurchaseRequestItem).find({
            where: { purchase_request: { id: savedPurchaseRequest.id } },
          });
        }
        return successResponse('Purchase request created successfully!', {
          purchaseRequest: savedPurchaseRequest,
          purchaseRequestItems: savedItems,
        });
      });
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to create purchase request');
    }
  }
  async findAll(filter?: number) {
    try {
      const where: any = {};
      if (filter !== undefined) {
        where.status = filter; // filter apply
      }
      const [purchase_request, total] = await this.prRepo.findAndCount({
        where,
      });
      return successResponse('purchase_request retrieved successfully!', {
        total_record: total,
        purchase_request,
      });
    } catch (error) {
      return errorResponse('Failed to retrieve purchase_request', error.message);
    }
  }
  async findOne(id: number) {
    try {
      const purchase_request = await this.prRepo.findOneBy({ id });
      if (!purchase_request) {
        return errorResponse(`purchase_request #${id} not found`);
      }

      return successResponse('purchase request retrieved successfully!', purchase_request);
    } catch (error) {
      return errorResponse('Failed to retrieve purchase_request', error.message);
    }
  }
  async update(id: number, updateDto: UpdatePurchaseRequestDto) {
    try {
      const existing = await this.prRepo.findOne({
        where: { id },
        relations: ['items'],
      });

      if (!existing) {
        return errorResponse(`purchase_request #${id} not found`);
      }

      // Check status
      if (existing.pr_status === "approved") {
        return errorResponse("You can't update, purchase request approved");
      }

      return await this.dataSource.transaction(async (manager) => {
        // 1️⃣ Update PurchaseRequest (without items)
        const { items, ...prData } = updateDto;
        const updatedPR = await manager.getRepository(PurchaseRequest).save({
          id,
          ...prData,
        });

        // 2️⃣ Handle Items
        if (items && items.length > 0) {
          // Delete old items
          await manager.getRepository(PurchaseRequestItem).delete({
            purchase_request: { id },
          });

          // Insert new items
          const newItems = items.map((item) =>
            manager.getRepository(PurchaseRequestItem).create({
              ...item,
              purchase_request: updatedPR,
              company_id: updatedPR.company_id,
              branch_id: updatedPR.branch_id,
            }),
          );

          await manager.getRepository(PurchaseRequestItem).save(newItems);
        }

        // Fetch updated items
        const savedItems = await manager.getRepository(PurchaseRequestItem).find({
          where: { purchase_request: { id } },
        });

        return successResponse('Purchase request updated successfully!', {
          purchaseRequest: updatedPR,
          items: savedItems,
        });
      });
    } catch (error) {
      return errorResponse('Failed to update Purchase Request', error.message);
    }
  } // working
  async statusUpdate(id: number) {
    try {
      const purchase_request = await this.prRepo.findOne({ where: { id } });
      if (!purchase_request) throw new NotFoundException('purchase_request not found');

      purchase_request.status = purchase_request.status === 0 ? 1 : 0;
      const saved = await this.prRepo.save(purchase_request);

      return toggleStatusResponse('purchase_request', saved.status);
    } catch (err) {
      return errorResponse('Something went wrong', err.message);
    }
  }
  async approvePr(id: number) {
    const existing = await this.prRepo.findOne({ where: { id } });
    if (!existing) {
      return errorResponse(`purchase request #${id} not found`);
    }

    const purchase_request = await this.prRepo.save({
      ...existing,
      pr_status: PurchaseRequestStatus.APPROVED,
    });
    return successResponse(
      `Purchase Request approved`,
    );
  }
}
