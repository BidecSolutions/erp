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
import { Warehouse } from '../warehouse/entities/warehouse.entity';
import { Stock } from '../stock/entities/stock.entity';

@Injectable()
export class PurchaseRequestService {

  constructor(
    @InjectRepository(PurchaseRequest)
    private readonly prRepo: Repository<PurchaseRequest>,
    @InjectRepository(PurchaseRequestItem)
    private readonly pr_itemsRepo: Repository<PurchaseRequestItem>,
    @InjectRepository(ModuleType)
    private readonly moduleTypeRepo: Repository<ModuleType>,
    @InjectRepository(Stock)
    private readonly stockRepo: Repository<Stock>,
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
  async store(createDto: CreatePurchaseRequestDto, userId:number, companyId:number) {
    try {
      const purchaseRequest = this.prRepo.create({
        ...createDto,
        company_id: companyId,
        user_id: userId
      });
      const savedPurchaseRequest = await this.prRepo.save(purchaseRequest);
      let savedItems: PurchaseRequestItem[] = [];

      if (createDto.items && createDto.items.length > 0) {
        const purchaseRequestItems = createDto.items.map((item) =>
          this.pr_itemsRepo.create({
            ...item,
            purchase_request: savedPurchaseRequest,
          }),
        );
        await this.pr_itemsRepo.save(purchaseRequestItems);

        savedItems = await this.pr_itemsRepo.find({
          where: { purchase_request: { id: savedPurchaseRequest.id } },
        });
      }
      return successResponse('Purchase request created successfully!', {
        purchaseRequest: savedPurchaseRequest,
        purchaseRequestItems: savedItems,
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
    const pr = await this.prRepo.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!pr) {
      return errorResponse(`Purchase Request #${id} not found`);
    }
  await this.prRepo.update(id, { pr_status: PurchaseRequestStatus.APPROVED });
  
    for (const item of pr.items) {
      const stock = await this.stockRepo.findOne({
        where: {
          company_id: pr.company_id,
          variant_id: item.variant_id,
        },
      });

      if (stock && stock.quantity_on_hand >= item.qty_requested) {
              item.pr_item_status = 'fullfilled';
        await this.pr_itemsRepo.save(item);
        // const transfer = this.stockTransferRepo.create({
        //   company_id: companyId,
        //   branch_id: existing.branch_id,
        //   variant_id: item.variant_id,
        //   quantity: item.quantity,
        //   status: 'pending_dispatch',
        //   reference_type: 'purchase_request',
        //   reference_id: existing.id,
        //   created_by: userId,
        // });
        // await this.stockTransferRepo.save(transfer);
      } else {
        item.pr_item_status = 'require_supplier';
        await this.pr_itemsRepo.save(item);
      }
    }
    return successResponse(
      `Purchase Request #${id} approved and stock checked successfully!`
    );
  }
}
