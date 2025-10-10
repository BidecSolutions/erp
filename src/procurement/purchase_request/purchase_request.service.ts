import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePurchaseRequestDto } from './dto/create-purchase_request.dto';
import { UpdatePurchaseRequestDto } from './dto/update-purchase_request.dto';
import { PurchaseRequest } from './entities/purchase_request.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { errorResponse, generateCode, getActiveList, successResponse, toggleStatusResponse } from 'src/commonHelper/response.util';
import { PurchaseRequestItem } from './entities/purchase-request-item.entity';
import { PurchaseRequestStatus } from '../enums/purchase-request.enum';
import { ModuleType } from '../module_type/entities/module_type.entity';
import { Warehouse } from '../warehouse/entities/warehouse.entity';
import { Stock } from '../stock/entities/stock.entity';
import { StockMovement } from '../stock_movement/entities/stock_movement.entity';
import { InternalTransferRequest } from './entities/itr.entity';
import { InternalTransferItem } from './entities/itr.items.entity';
import { ITRStatus } from '../enums/itr-enum';

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
    @InjectRepository(StockMovement)
    private readonly stockMovementRepo: Repository<StockMovement>,
    @InjectRepository(InternalTransferRequest)
    private readonly itrRepo: Repository<InternalTransferRequest>,
    @InjectRepository(InternalTransferItem)
    private readonly itrItemRepo: Repository<InternalTransferItem>,
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
  async store(createDto: CreatePurchaseRequestDto, userId: number, companyId: number) {
    try {
      const purchaseRequest = this.prRepo.create({
        ...createDto,
        company_id: companyId,
        created_by : userId
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
  async approvePr(id: number, companyId: number, userId: number) {
    const pr = await this.prRepo.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!pr) return errorResponse(`Purchase Request #${id} not found`);

    const headWarehouseId = 1;
    const branchWarehouseId = pr.branch_id ?? 2;

    const itrCode = await generateCode('internal_transfer_requests', 'ITR', this.dataSource);
    const itr = this.itrRepo.create({
      itr_code: itrCode,
      from_warehouse_id: headWarehouseId,
      to_warehouse_id: branchWarehouseId,
      remarks: "Stock transfer from head office to branch",
      company_id: companyId,
      branch_id: pr.branch_id,
      user_id: userId,
    });
    const savedItr = await this.itrRepo.save(itr);

    for (const item of pr.items) {
      const stock = await this.stockRepo.findOne({
        where: {
          company_id: pr.company_id,
          variant_id: item.variant_id,
          warehouse_id: headWarehouseId,
        },
      });

      if (stock && stock.quantity_on_hand >= item.qty_requested) {
        const itrItem = this.itrItemRepo.create({
          itr_id: savedItr.id,
          product_id: item.product_id,
          variant_id: item.variant_id,
          requested_qty: item.qty_requested,
          approved_qty: 0,
        });
        await this.itrItemRepo.save(itrItem);

        item.pr_item_status = 'itr_created';
      } else {
        item.pr_item_status = 'require_supplier';
      }

      await this.pr_itemsRepo.save(item);
    }

    await this.prRepo.update(id, { pr_status: PurchaseRequestStatus.APPROVED });

    return successResponse(`Purchase Request #${id} approved and stock processed successfully.`);
  }
  async approveItr(id: number, companyId: number, userId: number, approvedItems: any[]) {
    const itr = await this.itrRepo.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!itr) {
      return errorResponse(`ITR #${id} not found`);
    }
    await this.itrRepo.update(id, { status: ITRStatus.APPROVED });

    for (const approvedItem of approvedItems) {
      const existing = await this.itrItemRepo.findOneBy({ id: approvedItem.itr_item_id });
      console.log('Found item:', existing);
      await this.itrItemRepo.update(
        { id: approvedItem.itr_item_id },
        { approved_qty: approvedItem.approved_qty }
      );
    }
    const updatedItr = await this.itrRepo.findOne({
      where: { id },
      relations: ['items'],
    });

    const headWarehouseId = 1;
    const branchWarehouseId = updatedItr?.to_warehouse_id

    if (!updatedItr || !updatedItr.items?.length) {
      return errorResponse(`No items found for ITR #${id}`);
    }
    for (const item of updatedItr.items) {
      if (item.approved_qty <= 0) continue;
      const qty = item.approved_qty;
      await this.stockRepo.decrement(
        {
          variant_id: item.variant_id,
          warehouse_id: headWarehouseId,
          company_id: companyId,
        },
        'quantity_on_hand',
        qty,
      );

      let branchStock = await this.stockRepo.findOne({
        where: {
          variant_id: item.variant_id,
          warehouse_id: branchWarehouseId,
          company_id: companyId,

        },
      });

      if (branchStock) {
        await this.stockRepo.increment(
          { id: branchStock.id },
          'quantity_on_hand',
          qty,
        );
      } else {
        await this.stockRepo.save(
          this.stockRepo.create({
            product_id: item.product_id,
            variant_id: item.variant_id,
            warehouse_id: branchWarehouseId,
            company_id: companyId,
            quantity_on_hand: qty,
            branch_id:updatedItr.branch_id
          }),
        );
      }
      await this.stockMovementRepo.save(
        this.stockMovementRepo.create({
          product_id: item.product_id,
          variant_id: item.variant_id,
          from_warehouse_id: headWarehouseId,
          to_warehouse_id: branchWarehouseId,
          quantity: qty,
          company_id: companyId,
          branch_id: updatedItr.branch_id,
          user_id: userId,
        }),
      );
    }
    return successResponse(`ITR #${id} approved successfully.`);
  }




}
