import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Supplier } from './supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Company } from '../companies/company.entity';
import { SupplierCategory } from '../supplier-category/supplier-category.entity';
import { SupplierAccount } from './supplier.supplier_account.entity';
import { errorResponse, toggleStatusResponse } from "src/commonHelper/response.util";

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

  async create(dto: CreateSupplierDto, userId: number, company_id: number) {
    try {
      // Validate category
      const category = await this.categoryRepo.findOne({
        where: { id: dto.supplier_category_id, is_active: 1 },
      });
      if (!category) {
        return { success: false, message: `Supplier category with ID ${dto.supplier_category_id} not found or inactive` };
      }

      // Create supplier with company_id directly assigned
      const supplier = this.supplierRepo.create({
        ...dto,
        company: { id: company_id } as Company,
        created_by: userId,
        category: { id: dto.supplier_category_id } as SupplierCategory,

      });

      const saved = await this.supplierRepo.save(supplier);

      // Create default supplier account with amount = 0
      const account = this.supplierAccountRepo.create({
        supplier: { id: saved.id } as Supplier,
        amount: 0,
      });
      await this.supplierAccountRepo.save(account);

      // Get all suppliers for this company
      const suppliers = await this.findAll(company_id);

      return suppliers;
    } catch (e) {
      return { message: e.message };
    }
  }


  async findAll(company_id: number) {
    try {
      const suppliers = await this.supplierRepo
        .createQueryBuilder("supplier")
        .leftJoin("supplier.company", "company")
        .leftJoin("supplier.category", "category")
        .select([
          "supplier.id as id",
          "supplier.supplier_code as supplier_code",
          "supplier.supplier_name as supplier_name",
          "supplier.contact_person as contact_person",
          "supplier.designation as designation",
          "supplier.email as email",
          "supplier.phone as phone",
          "supplier.mobile as mobile",
          "supplier.website as website",
          "supplier.address_line1 as address_line1",
          "supplier.address_line2 as address_line2",
          "supplier.city as city",
          "supplier.state as state",
          "supplier.country as country",
          "supplier.postal_code as postal_code",
          "supplier.payment_terms as payment_terms",
          "supplier.credit_days as credit_days",
          "supplier.tax_id as tax_id",
          "supplier.gst_no as gst_no",
          "supplier.pan_no as pan_no",
          "supplier.opening_balance as opening_balance",
          "supplier.balance_type as balance_type",
          "supplier.supplier_status as supplier_status",
          "supplier.registration_date as registration_date",
          "supplier.notes as notes",
          "supplier.bank_account_no as bank_account_no",
          "supplier.bank_name as bank_name",
          "supplier.ifsc_code as ifsc_code",
          "supplier.is_active as is_active",
          "supplier.company_id as company_id",
          "category.category_name as category_name",
          "category.id as category_id",
          "supplier.created_by as created_by",
        ])
        .where("supplier.company_id = :company_id", { company_id })
        .orderBy("supplier.id", "DESC")
        .getRawMany();

      return suppliers;
    } catch (error) {
      return { message: error.message };
    }
  }


  async findOne(id: number) {
    try {
      const supplier = await this.supplierRepo
        .createQueryBuilder("supplier")
        .leftJoin("supplier.company", "company")
        .leftJoin("supplier.category", "category")
        .select([
          "supplier.id as id",
          "supplier.supplier_code as supplier_code",
          "supplier.supplier_name as supplier_name",
          "supplier.contact_person as contact_person",
          "supplier.designation as designation",
          "supplier.email as email",
          "supplier.phone as phone",
          "supplier.mobile as mobile",
          "supplier.website as website",
          "supplier.address_line1 as address_line1",
          "supplier.address_line2 as address_line2",
          "supplier.city as city",
          "supplier.state as state",
          "supplier.country as country",
          "supplier.postal_code as postal_code",
          "supplier.payment_terms as payment_terms",
          "supplier.credit_days as credit_days",
          "supplier.tax_id as tax_id",
          "supplier.gst_no as gst_no",
          "supplier.pan_no as pan_no",
          "supplier.opening_balance as opening_balance",
          "supplier.balance_type as balance_type",
          "supplier.supplier_status as supplier_status",
          "supplier.registration_date as registration_date",
          "supplier.notes as notes",
          "supplier.bank_account_no as bank_account_no",
          "supplier.bank_name as bank_name",
          "supplier.ifsc_code as ifsc_code",
          "supplier.is_active as is_active",
          "supplier.company_id as company_id",
          "category.category_name as category_name",
          "category.id as category_id ",
          "supplier.created_by as created_by",
        ])
        .where("supplier.id = :id", { id })
        .getRawOne();

      if (!supplier) throw new NotFoundException(`Supplier ID ${id} not found`);

      return supplier;
    } catch (error) {
      return { message: error.message };
    }
  }


  async update(id: number, dto: UpdateSupplierDto, company_id: number) {
    try {
      const supplier = await this.supplierRepo.findOne({ where: { id, is_active: 1, } });
      if (!supplier) return { success: false, message: 'Supplier not found or inactive' };

      if (dto.supplier_category_id) {
        const category = await this.categoryRepo.findOne({
          where: { id: dto.supplier_category_id, is_active: 1 },
        });
        if (!category) return { success: false, message: `Supplier category with ID ${dto.supplier_category_id} not found or inactive` };
        supplier.category = { id: dto.supplier_category_id } as SupplierCategory;
      }

      Object.assign(supplier, dto);
      await this.supplierRepo.save(supplier);
      const updated = await this.findAll(company_id);
      return updated;
    } catch (e) {
      return { message: e.message };
    }
  }

  async toggleStatus(company: number, id: number) {
    try {
      const supplier = await this.supplierRepo.findOneBy({ id });
      if (!supplier) throw new NotFoundException("Supplier not found");

      // Toggle the status
      supplier.is_active = supplier.is_active === 0 ? 1 : 0;

      await this.supplierRepo.save(supplier);

      // Use your existing response helper (like in Customer)
      return this.findAll(company);
    } catch (err) {
      return errorResponse("Something went wrong", err.message);
    }
  }

}
