import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from '../branch/branch.entity';
import { CreateBranchDto } from '../branch/dto/create-branch.dto';
import { UpdateBranchDto } from '../branch/dto/update-branch.dto';
import { Company } from '../companies/company.entity';

@Injectable()
export class BranchService {
    constructor(
        @InjectRepository(Branch) private branchRepo: Repository<Branch>,
        @InjectRepository(Company) private companyRepo: Repository<Company>,
    ) { }

    async create(dto: CreateBranchDto) {
        try {
            const company = await this.companyRepo.findOneBy({ id: dto.companyId });
            if (!company) return { success: false, message: `Company with ID ${dto.companyId} not found` };

            const branch = this.branchRepo.create({
                ...dto,
                company: { id: dto.companyId } as Company,
                is_active: 1,
            });

            const savedBranch = await this.branchRepo.save(branch);
            return { success: true, message: 'Branch created successfully', data: savedBranch };
        } catch (error) {
            return { success: false, message: 'Failed to create branch' };
        }
    }

    async findAll() {
        try {
            const branches = await this.branchRepo
                .createQueryBuilder('branch')
                .leftJoinAndSelect('branch.company', 'company')
                .select([
                    'branch.id',
                    'branch.branch_code',
                    'branch.branch_name',
                    'branch.address_line1',
                    'branch.city',
                    'branch.state',
                    'branch.country',
                    'branch.postal_code',
                    'branch.phone',
                    'branch.mobile',
                    'branch.email',
                    'branch.manager_name',
                    'branch.manager_email',
                    'branch.manager_phone',
                    'branch.opening_balance',
                    'branch.bank_account_no',
                    'branch.bank_name',
                    'branch.ifsc_code',
                    'branch.is_head_office',
                    'branch.allow_negative_stock',
                    'branch.is_active',
                    'branch.created_by',
                    'branch.created_date',
                    'branch.updated_by',
                    'branch.updated_date',
                    'branch.is_active',
                    'company.id',
                    'company.company_name',
                ])
                .where('branch.is_active = :isActive', { isActive: 1 })
                .orderBy('branch.id', 'DESC')
                .getMany();
            return { success: true, message: 'Branches retrieved successfully', data: branches };
        } catch (error) {
            return { success: false, message: 'Failed to retrieve branches' };
        }
    }

    async findOne(id: number) {
        try {
            const branch = await this.branchRepo
                .createQueryBuilder('branch')
                .leftJoin('branch.company', 'company')
                .where('branch.id = :id', { id })
                .andWhere('branch.is_active = :isActive', { isActive: 1 })
                .select([
                    'branch.id',
                    'branch.branch_code',
                    'branch.branch_name',
                    'branch.branch_type',
                    'branch.address_line1',
                    'branch.address_line2',
                    'branch.city',
                    'branch.state',
                    'branch.country',
                    'branch.postal_code',
                    'branch.phone',
                    'branch.mobile',
                    'branch.email',
                    'branch.manager_name',
                    'branch.manager_email',
                    'branch.manager_phone',
                    'branch.opening_balance',
                    'branch.bank_account_no',
                    'branch.bank_name',
                    'branch.ifsc_code',
                    'branch.is_head_office',
                    'branch.allow_negative_stock',
                    'branch.is_active',
                    'branch.created_by',
                    'branch.created_date',
                    'branch.updated_by',
                    'branch.updated_date',
                    'company.id',
                    'company.company_name',
                ])
                .getRawOne();

            if (!branch) return { success: false, message: `Branch with ID ${id} not found` };

            // Transform raw result to match desired nested structure
            const data = {
                id: branch.branch_id,
                branch_code: branch.branch_branch_code,
                branch_name: branch.branch_branch_name,
                branch_type: branch.branch_branch_type,
                address_line1: branch.branch_address_line1,
                address_line2: branch.branch_address_line2,
                city: branch.branch_city,
                state: branch.branch_state,
                country: branch.branch_country,
                postal_code: branch.branch_postal_code,
                phone: branch.branch_phone,
                mobile: branch.branch_mobile,
                email: branch.branch_email,
                manager_name: branch.branch_manager_name,
                manager_email: branch.branch_manager_email,
                manager_phone: branch.branch_manager_phone,
                opening_balance: branch.branch_opening_balance,
                bank_account_no: branch.branch_bank_account_no,
                bank_name: branch.branch_bank_name,
                ifsc_code: branch.branch_ifsc_code,
                is_head_office: branch.branch_is_head_office,
                allow_negative_stock: branch.branch_allow_negative_stock,
                is_active: branch.branch_is_active,
                created_by: branch.branch_created_by,
                created_date: branch.branch_created_date,
                updated_by: branch.branch_updated_by,
                updated_date: branch.branch_updated_date,
                company: {
                    id: branch.company_id,
                    company_name: branch.company_company_name,
                },
            };

            return { success: true, message: 'Branch retrieved successfully', data };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Failed to retrieve branch' };
        }
    }


    async update(id: number, dto: UpdateBranchDto) {
        try {
            const branch = await this.branchRepo.findOneBy({ id });
            if (!branch) return { success: false, message: 'Branch not found' };

            // If companyId is provided, fetch and assign the relation
            if (dto.companyId) {
                const company = await this.companyRepo.findOneBy({ id: dto.companyId });
                if (!company) {
                    return { success: false, message: 'Company not found' };
                }
                branch.company = { id: dto.companyId } as Company;
            }


            Object.assign(branch, dto);
            branch.updated_date = new Date().toISOString().split('T')[0];

            const updatedBranch = await this.branchRepo.save(branch);
            return { success: true, message: 'Branch updated successfully', data: updatedBranch };
        } catch (error) {
            return { success: false, message: 'Failed to update branch' };
        }
    }

    async remove(id: number, updatedBy: number) {
        try {
            const branch = await this.branchRepo.findOneBy({ id });
            if (!branch) return { success: false, message: 'Branch not found' };

            branch.is_active = 2; // soft delete
            branch.updated_date = new Date().toISOString().split('T')[0];

            await this.branchRepo.save(branch);
            return { success: true, message: `Branch with ID ${id} set to inactive`, data: branch };
        } catch (error) {
            return { success: false, message: 'Failed to remove branch' };
        }
    }
}
