import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PurchaseOrder } from './entities/purchase_order.entity';
import { PurchaseOrderItem } from './entities/purchase_order_items.entity';
import { CreatePurchaseOrderDto, CreatePurchaseOrderItemDto } from './dto/create-purchase_order.dto';
import { PurchaseOrderStatus } from '../enums/purchase-order.enum';
import { errorResponse, successResponse, toggleStatusResponse } from 'src/commonHelper/response.util';
import { PurchaseRequest } from '../purchase_request/entities/purchase_request.entity';
import { UpdatePurchaseOrderDto } from './dto/update-purchase_order.dto';

@Injectable()
export class PurchaseOrderService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private readonly purchaseOrderRepo: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseOrderItem)
    private readonly purchaseOrderItemRepo: Repository<PurchaseOrderItem>,
    @InjectRepository(PurchaseRequest)
    private readonly prRepo: Repository<PurchaseRequest>,
    private readonly dataSource: DataSource,
  ) { }
  async store(createDto: CreatePurchaseOrderDto) {
    try {
      const po = await this.prRepo.findOneBy({ id: createDto.pr_id });
      if (!po) {
        return errorResponse(`Purchase Request #${createDto.pr_id} not found`);
      }
      if ((po.pr_status ?? '').toLowerCase().trim() !== 'approved') {
        return errorResponse("Can't create purchase order, purchase request still pending");
      }
      return await this.dataSource.transaction(async (manager) => {
        const totalAmount = createDto.items.reduce(
          (sum, item) => sum + item.quantity * item.unit_price,
          0,
        );
        const data = this.purchaseOrderRepo.create({
          pr_id: createDto.pr_id,
          supplier_id: createDto.supplier_id,
          company_id: createDto.company_id,
          branch_id: createDto.branch_id,
          order_date: createDto.order_date,
          expected_delivery_date: createDto.expected_delivery_date,
          total_amount: totalAmount,
          po_status: PurchaseOrderStatus.PENDING
        });
        const po = await manager.save(data);
        const items = createDto.items.map((item: CreatePurchaseOrderItemDto) =>
          this.purchaseOrderItemRepo.create({
            purchase_order_id: po.id,
            product_id: item.product_id,
            variant_id: item.variant_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_amount: item.quantity * item.unit_price,
          }),
        );
        await manager.save(items);
        return successResponse("purchase orders created succescfully", {
          po,
          items
        })
      });
    } catch (error) {
      throw new Error(`Failed to create Purchase Order: ${error.message}`);
    }
  }
  async findAll(filter?: number) {
    try {
      const where: any = {};
      if (filter !== undefined) {
        where.status = filter; // filter apply
      }
      const [purchase_order, total] = await this.purchaseOrderRepo.findAndCount({
        where,
      });
      return successResponse('purchase order retrieved successfully!', {
        total_record: total,
        purchase_order,
      });
    } catch (error) {
      return errorResponse('Failed to retrieve purchase order', error.message);
    }
  }
  async findOne(id: number) {
    try {
      const purchase_order = await this.purchaseOrderRepo.findOneBy({ id });
      if (!purchase_order) {
        return errorResponse(`purchase order #${id} not found`);
      }

      return successResponse('purchase order retrieved successfully!', purchase_order);
    } catch (error) {
      return errorResponse('Failed to retrieve purchase order', error.message);
    }
  }
  async update(id: number, updateDto: UpdatePurchaseOrderDto) {
    try {
      const existing = await this.purchaseOrderRepo.findOne({ where: { id } });
      if (!existing) {
        return errorResponse(`purchase_order #${id} not found`);
      }

      const purchase_order = await this.purchaseOrderRepo.save({ id, ...updateDto });
      return successResponse('purchase_order updated successfully!', purchase_order);
    } catch (error) {
      return errorResponse('Failed to update purchase_order', error.message);
    }
  } // working
  async statusUpdate(id: number) {
    try {
      const purchase_order = await this.purchaseOrderRepo.findOne({ where: { id } });
      if (!purchase_order) throw new NotFoundException('purchase_order not found');

      purchase_order.status = purchase_order.status === 0 ? 1 : 0;
      const saved = await this.purchaseOrderRepo.save(purchase_order);

      return toggleStatusResponse('purchase order', saved.status);
    } catch (err) {
      return errorResponse('Something went wrong', err.message);
    }
  }
  async approveOrder(id: number) {
    const existing = await this.purchaseOrderRepo.findOne({ where: { id } });
    if (!existing) {
      return errorResponse(`purchase order #${id} not found`);
    }

    const purchase_order = await this.purchaseOrderRepo.save({
      ...existing,
      po_status: PurchaseOrderStatus.APPROVED,

    });
    return successResponse(
      "Purchase order approved"
    );
  }
}


