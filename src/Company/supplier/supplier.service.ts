import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Company } from '../companies/company.entity';
import { SupplierCategory } from '../supplier-category/supplier-category.entity';

@Injectable()
export class SupplierService {
    constructor(
        @InjectRepository(Supplier)
        private readonly supplierRepo: Repository<Supplier>,
        @InjectRepository(Company)
        private readonly companyRepo: Repository<Company>,
        @InjectRepository(SupplierCategory)
        private readonly categoryRepo: Repository<SupplierCategory>,
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
            return { success: true, message: 'Supplier created successfully', data: saved };
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
