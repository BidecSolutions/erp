import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Supplier } from './supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Company } from '../companies/company.entity';
import { SupplierCategory } from '../supplier-category/supplier-category.entity';
import { SupplierAccount } from './supplier.supplier_account.entity';

@Injectable()
export class SupplierService {
    constructor(
        @InjectRepository(Supplier)
        private readonly supplierRepo: Repository<Supplier>,
        @InjectRepository(Company)
        private readonly companyRepo: Repository<Company>,
        @InjectRepository(SupplierCategory)
        private readonly categoryRepo: Repository<SupplierCategory>,
        @InjectRepository(SupplierAccount)
        private readonly supplierAccountRepo: Repository<SupplierAccount>,
    ) { }

    async create(dto: CreateSupplierDto) {
        try {
            const company = await this.companyRepo.findOne({
                where: { id: dto.company_id, status: 1 },
            });
            if (!company) {
                return { success: false, message: `Company with ID ${dto.company_id} not found or inactive` };
            }

            const category = await this.categoryRepo.findOne({
                where: { id: dto.supplier_category_id, is_active: 1 },
            });
            if (!category) {
                return { success: false, message: `Supplier category with ID ${dto.supplier_category_id} not found or inactive` };
            }

            const supplier = this.supplierRepo.create({
                ...dto,
                company: { id: dto.company_id } as Company,
                category: { id: dto.supplier_category_id } as SupplierCategory,
            });

            const saved = await this.supplierRepo.save(supplier);

            // ✅ Create default supplier_account with amount = 0
            const account = this.supplierAccountRepo.create({
                supplier: { id: saved.id } as Supplier, // only attach id
                amount: 0,
            });
            const savedAccount = await this.supplierAccountRepo.save(account);


            return {
                success: true, message: 'Supplier created successfully', data: {
                    ...saved,
                    account: {
                        id: savedAccount.id,
                        amount: savedAccount.amount,
                    },
                },
            };
        } catch (error) {
            return { success: false, message: 'Failed to create supplier', error };
        }
    }

    async findAll() {
        try {
            const suppliers = await this.supplierRepo.find({
                relations: ['company', 'category'],
                where: { is_active: 1 },
                order: { id: 'DESC' },
                select: {
                    id: true,
                    supplier_code: true,
                    supplier_name: true,
                    contact_person: true,
                    designation: true,
                    email: true,
                    phone: true,
                    mobile: true,
                    website: true,
                    address_line1: true,
                    address_line2: true,
                    city: true,
                    state: true,
                    country: true,
                    postal_code: true,
                    payment_terms: true,
                    credit_days: true,
                    tax_id: true,
                    gst_no: true,
                    pan_no: true,
                    opening_balance: true,
                    balance_type: true,
                    supplier_status: true,
                    registration_date: true,
                    notes: true,
                    bank_account_no: true,
                    bank_name: true,
                    ifsc_code: true,
                    is_active: true,
                    created_by: true,
                    created_date: true,
                    updated_by: true,
                    updated_date: true,
                    company: {
                        id: true,
                        company_name: true,
                    },
                    category: {
                        id: true,
                        category_name: true,
                    },
                },
            });
            return { success: true, data: suppliers };
        } catch (error) {
            return { success: false, message: 'Failed to fetch suppliers', error };
        }
    }

    async findOne(id: number) {
        try {
            const supplier = await this.supplierRepo.findOne({
                where: { id, is_active: 1 },
                relations: ['company', 'category'],
                select: {
                    id: true,
                    supplier_code: true,
                    supplier_name: true,
                    contact_person: true,
                    designation: true,
                    email: true,
                    phone: true,
                    mobile: true,
                    website: true,
                    address_line1: true,
                    address_line2: true,
                    city: true,
                    state: true,
                    country: true,
                    postal_code: true,
                    payment_terms: true,
                    credit_days: true,
                    tax_id: true,
                    gst_no: true,
                    pan_no: true,
                    opening_balance: true,
                    balance_type: true,
                    supplier_status: true,
                    registration_date: true,
                    notes: true,
                    bank_account_no: true,
                    bank_name: true,
                    ifsc_code: true,
                    is_active: true,
                    created_by: true,
                    created_date: true,
                    updated_by: true,
                    updated_date: true,
                    company: {
                        id: true,
                        company_name: true,
                    },
                    category: {
                        id: true,
                        category_name: true,
                    },
                },
            });
            if (!supplier) return { success: false, message: `Supplier with ID ${id} not found` };
            return { success: true, data: supplier };
        } catch (error) {
            return { success: false, message: 'Failed to fetch supplier', error };
        }
    }

    async update(id: number, dto: UpdateSupplierDto) {
        try {
            const supplier = await this.supplierRepo.findOne({ where: { id, is_active: 1 } });
            if (!supplier) return { success: false, message: 'Supplier not found or inactive' };

            if (dto.company_id) {
                const company = await this.companyRepo.findOne({
                    where: { id: dto.company_id, status: 1 },
                });
                if (!company) return { success: false, message: `Company with ID ${dto.company_id} not found or inactive` };
                supplier.company = { id: dto.company_id } as Company;
            }

            if (dto.supplier_category_id) {
                const category = await this.categoryRepo.findOne({
                    where: { id: dto.supplier_category_id, is_active: 1 },
                });
                if (!category) return { success: false, message: `Supplier category with ID ${dto.supplier_category_id} not found or inactive` };
                supplier.category = { id: dto.supplier_category_id } as SupplierCategory;
            }

            Object.assign(supplier, dto);
            const updated = await this.supplierRepo.save(supplier);
            return { success: true, message: 'Supplier updated successfully', data: updated };
        } catch (error) {
            return { success: false, message: 'Failed to update supplier', error };
        }
    }

    async remove(id: number) {
        try {
            const supplier = await this.supplierRepo.findOne({ where: { id, is_active: 1 } });
            if (!supplier) return { success: false, message: 'Supplier not found or already inactive' };

            supplier.is_active = 2;
            await this.supplierRepo.save(supplier);

            return { success: true, message: 'Supplier deleted successfully (soft delete)', data: supplier };
        } catch (error) {
            return { success: false, message: 'Failed to delete supplier', error };
        }
    }
}
