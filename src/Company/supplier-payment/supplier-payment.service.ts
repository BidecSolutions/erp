import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupplierPayment } from './supplier-payment.entity';
import { CreateSupplierPaymentDto } from './dto/create-supplier-payment.dto';
import { Company } from '../companies/company.entity';
import { Supplier } from '../supplier/supplier.entity';

@Injectable()
export class SupplierPaymentService {
  constructor(
    @InjectRepository(SupplierPayment)
    private paymentRepo: Repository<SupplierPayment>,
  ) {}

  async create(dto: CreateSupplierPaymentDto) {
    try {
      const payment = this.paymentRepo.create({
        ...dto,
        company: { id: dto.company_id } as Company,
        supplier: { id: dto.supplier_id } as Supplier,
      });

      const saved = await this.paymentRepo.save(payment);
      return { success: true, message: 'Supplier Payment created successfully', data: saved };
    } catch (error) {
      return { success: false, message: 'Failed to create supplier payment', error: error.message };
    }
  }
}
