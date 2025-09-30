import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupplierInvoice } from './supplier-invoice.entity';
import { CreateSupplierInvoiceDto } from './dto/create-supplier-invoice.dto';
import { Company } from '../companies/company.entity';
import { Supplier } from '../supplier/supplier.entity';

@Injectable()
export class SupplierInvoiceService {
  constructor(
    @InjectRepository(SupplierInvoice)
    private invoiceRepo: Repository<SupplierInvoice>,
  ) {}

  async create(dto: CreateSupplierInvoiceDto) {
    try {
      const invoice = this.invoiceRepo.create({
        ...dto,
        company: { id: dto.company_id } as Company,
        supplier: { id: dto.supplier_id } as Supplier,
      });

      const saved = await this.invoiceRepo.save(invoice);
      return { success: true, message: 'Supplier Invoice created successfully', data: saved };
    } catch (error) {
      return { success: false, message: 'Failed to create supplier invoice', error: error.message };
    }
  }
}
