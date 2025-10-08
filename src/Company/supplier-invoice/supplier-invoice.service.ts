import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateSupplierInvoiceDto } from './dto/create-supplier-invoice.dto';
import { Company } from '../companies/company.entity';
import { Supplier } from '../supplier/supplier.entity';
import { errorResponse, generateCode, successResponse, toggleStatusResponse } from 'src/commonHelper/response.util';
import { SupplierInvoice } from './entities/supplier-invoice.entity';
import { SupplierInvoiceItem } from './entities/supplier-invoice-item';
import { response } from 'express';
import { UpdateSupplierInvoiceDto } from './dto/update-supplier-invoice.dto';
import { supplierInvoice } from 'src/procurement/enums/supplier-invoice.enum';
import { PurchaseOrder } from 'src/procurement/purchase_order/entities/purchase_order.entity';
import { PurchaseGrn } from 'src/procurement/goods_receiving_note/entities/goods_receiving_note.entity';

@Injectable()
export class SupplierInvoiceService {
  constructor(
    @InjectRepository(SupplierInvoice)
    private invoiceRepo: Repository<SupplierInvoice>,
    @InjectRepository(PurchaseOrder)
    private poRepo: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseGrn)
    private grnRepo: Repository<PurchaseGrn>,
    private readonly dataSource: DataSource,

  ) { }

  async store(dto: CreateSupplierInvoiceDto, userId: number, companyId: number) {
    try {
      const po = await this.poRepo.findOneBy({ id: dto.purchase_order_id });
      if (!po) {
        return errorResponse(`Purchase Request #${dto.purchase_order_id} not found`);
      }
      // if ((po.po_status ?? '').toLowerCase().trim() !== 'approved') {
      //   return errorResponse("Can't create Invoice, purchase order still pending");
      // }
      return await this.dataSource.transaction(async (manager) => {
        const po = await this.poRepo.findOne({
          where: { id: dto.purchase_order_id },
          relations: ['items'],
        });

        if (!po) {
          throw new Error(`Purchase Order #${dto.purchase_order_id} not found`);
        }
        const grn = await this.grnRepo.findOne({
          where: { po_id: po.id },
          relations: ['items'],
        });

        if (!grn) {
          throw new NotFoundException(`GRN for PO #${po.id} not found`);
        }
        const netAmount = po.total_amount + (dto.tax_amount || 0) - (dto.discount_amount || 0);
        const invoiceNumber = await generateCode('supplier invoice', 'INV', this.dataSource);
        const invoice = manager.create(SupplierInvoice, {
          supplier: { id: po.supplier_id },
          company_id: companyId,
          user_id :userId,
          branch: { id: po.branch_id },
          purchaseOrder: { id: po.id },
          invoice_date: dto.invoice_date,
          invoice_number: invoiceNumber,
          due_date: dto.due_date,
          payment_terms: dto.payment_terms,
          total_amount: po.total_amount,
          tax_amount: dto.tax_amount ?? 0,
          discount_amount: dto.discount_amount ?? 0,
          net_amount: netAmount,
          notes: dto.notes,
          inv_status: supplierInvoice.UNPAID,
          payment_method: dto.payment_method,
          outstanding_amount: netAmount,
          attachment_path: dto.attachment_path,


        });
        const savedInvoice = await manager.save(invoice);

        for (const item of po.items) {
          const invoiceItem = manager.create(SupplierInvoiceItem, {
            invoice_id: savedInvoice.id,
            product_id: item.product_id,
            variant_id: item.variant_id,
            unit_price: item.unit_price,
            total_price: item.quantity * item.unit_price,
            ordered_qty:item.quantity,
            received_qty:0,
            accept_qty:0,
            reject_qty:0

        
          });
          await manager.save(invoiceItem);
        }
        return successResponse("Supplier Invoice created successfully", savedInvoice)
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Inovice already exists');
      }
      throw new BadRequestException(error.message || 'Failed to create Inovoice');
    }
  }
 

  async findAll(filter?: number) {
    try {
      const where: any = {};
      if (filter !== undefined) {
        where.status = filter; // filter apply
      }
      const [supplier_invoice, total] = await this.invoiceRepo.findAndCount({
        where,
      });
      return successResponse('Invoice retrieved successfully!', {
        total_record: total,
        supplier_invoice,
      });
    } catch (error) {
      return errorResponse('Failed to retrieve Invoice', error.message);
    }
  }
  async findOne(id: number) {
    try {
      const supplier_invoice = await this.invoiceRepo.findOneBy({ id });
      if (!supplier_invoice) {
        return errorResponse(`supplier_invoice #${id} not found`);
      }

      return successResponse('supplier invoice retrieved successfully!', supplier_invoice);
    } catch (error) {
      return errorResponse('Failed to retrieve supplier invoice', error.message);
    }
  }
  async update(id: number, updateDto: UpdateSupplierInvoiceDto) {
    try {
      const existing = await this.invoiceRepo.findOne({ where: { id } });
      if (!existing) {
        return errorResponse(`supplier invoice #${id} not found`);
      }

      const supplier_invoice = await this.invoiceRepo.save({ id, ...updateDto });
      return successResponse('supplier invoice updated successfully!', supplier_invoice);
    } catch (error) {
      return errorResponse('Failed to update supplier invoice', error.message);
    }
  } //WORKING
  async statusUpdate(id: number) {
    try {
      const supplier_invoice = await this.invoiceRepo.findOne({ where: { id } });
      if (!supplier_invoice) throw new NotFoundException('supplier invoice not found');

      supplier_invoice.status = supplier_invoice.status === 0 ? 1 : 0;
      const saved = await this.invoiceRepo.save(supplier_invoice);

      return toggleStatusResponse('supplier invoice', saved.status);
    } catch (err) {
      return errorResponse('Something went wrong', err.message);
    }
  }
}
