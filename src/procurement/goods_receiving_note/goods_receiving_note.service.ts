import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseGrn } from './entities/goods_receiving_note.entity';
import { PurchaseGrnItem } from './entities/goods_receiving_note-item.entity';
import { PurchaseOrder } from '../purchase_order/entities/purchase_order.entity';
import { CreatePurchaseGrnDto } from './dto/create-goods_receiving_note.dto';
import { Stock } from '../stock/entities/stock.entity';
import { StockMovement } from '../stock_movement/entities/stock_movement.entity';
import { errorResponse, successResponse, toggleStatusResponse } from 'src/commonHelper/response.util';
import { grnStatus } from '../enums/grn-enum';
import { UpdatePurchaseGrnDto } from './dto/update-goods_receiving_note.dto';


@Injectable()
export class GoodsReceivingNoteService {
  constructor(
    @InjectRepository(PurchaseGrn)
    private readonly grnRepo: Repository<PurchaseGrn>,
    @InjectRepository(PurchaseGrnItem)
    private readonly grnItemRepo: Repository<PurchaseGrnItem>,
    @InjectRepository(PurchaseOrder)
    private readonly poRepo: Repository<PurchaseOrder>,
    @InjectRepository(Stock)
    private readonly stockRepo: Repository<Stock>,
  ) {}

  async store(dto: CreatePurchaseGrnDto) {
    const po = await this.poRepo.findOne({ where: { id: dto.po_id } });
    if (!po) {
      throw new NotFoundException(`Purchase Order with id ${dto.po_id} not found`);
    }
    const pr = await this.poRepo.findOne({
      where: { id: dto.po_id },
    });
    if (!pr || pr.po_status !== 'approved') {
      return errorResponse("Purchase Order not approved")
    }
    let totalAmount = 0;
    dto.items.forEach((item) => {
      totalAmount += item.received_quantity * item.unit_price;
    });
    const grn = this.grnRepo.create({
      po_id: dto.po_id,
      grn_date: dto.grn_date,
      remarks: dto.remarks,
      total_received_amount: totalAmount,

    });
    const savedGrn = await this.grnRepo.save(grn);
    const grnItems = dto.items.map((item) =>
      this.grnItemRepo.create({
        grn_id: savedGrn.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        received_quantity: item.received_quantity,
        unit_price: item.unit_price,
        total_price: item.received_quantity * item.unit_price,
        remarks: item.remarks,
        grn_status: item.grn_status,
      }),
    );
    await this.grnItemRepo.save(grnItems);
    for (const item of grnItems) {
      let stock = await this.stockRepo.findOne({
        where: {
          variant_id: item.variant_id,
          warehouse_id: dto.warehouse_id,
          company_id: dto.company_id,
          branch_id: dto.branch_id,
        },
      });
      if (stock) {
        stock.quantity_on_hand += item.received_quantity;
      } else {
        stock = this.stockRepo.create({
          product_id: item.product_id,
          variant_id: item.variant_id,
          warehouse_id: dto.warehouse_id,
          company_id: dto.company_id,
          branch_id: dto.branch_id,
          quantity_on_hand: item.received_quantity,
          reorder_level: 0,
          reorder_quantity: 0,
        });
      }
      await this.stockRepo.save(stock);
    }

    return successResponse("GRN created successfully", {
      grn: savedGrn,
      grnItems: grnItems,
    })
  }
    async findAll(filter?: number) {
        try {
          const where: any = {};
          if (filter !== undefined) {
            where.status = filter; // filter apply
          }
          const [grn, total] = await this.grnRepo.findAndCount({
            where,
          });
          return successResponse('grn retrieved successfully!', {
            total_record: total,
            grn,
          });
        } catch (error) {
          return errorResponse('Failed to retrieve grn', error.message);
        }
      }
    async findOne(id: number) {
        try {
          const grn = await this.grnRepo.findOneBy({ id });
          if (!grn) {
            return errorResponse(`grn #${id} not found`);
          }
      
          return successResponse('grn retrieved successfully!', grn);
        } catch (error) {
          return errorResponse('Failed to retrieve grn', error.message);
        }
      }
    async update(id: number, updateDto: UpdatePurchaseGrnDto) {
        try {
          const existing = await this.grnRepo.findOne({ where: { id } });
          if (!existing) {
            return errorResponse(`grn #${id} not found`);
          }
      
          const grn = await this.grnRepo.save({ id, ...updateDto });
          return successResponse('grn updated successfully!', grn);
        } catch (error) {
          return errorResponse('Failed to update grn', error.message);
        }
      } // working
    async statusUpdate(id: number) {
    try {
      const grn = await this.grnRepo.findOne({ where: { id } });
      if (!grn) throw new NotFoundException('grn not found');
      grn.status = grn.status === 0 ? 1 : 0;
      const saved = await this.grnRepo.save(grn);
  
      return toggleStatusResponse('grn', saved.status);
    } catch (err) {
      return errorResponse('Something went wrong', err.message);
    }
      }
    async partiallyReceived(id: number) {
      const existing = await this.grnRepo.findOne({ where: { id } });
      if (!existing) {
        return errorResponse(`purchase grn #${id} not found`);
      }
    
      const purchase_grn = await this.grnRepo.save({
        ...existing, 
        grn_status: grnStatus.PARTIALLY_RECEIVED, 
      });
      return successResponse(
           "GRN  status updated"
      );
    }
    async fullyReceived(id: number) {
      const existing = await this.grnRepo.findOne({ where: { id } });
      if (!existing) {
        return errorResponse(`purchase grn #${id} not found`);
      }
    
      const purchase_grn = await this.grnRepo.save({
        ...existing, 
        grn_status: grnStatus.FULLY_RECEIVED, 
      });
      return successResponse(
           "GRN status updated"
      );
    }
}
