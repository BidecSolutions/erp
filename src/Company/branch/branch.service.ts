import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,DataSource } from 'typeorm';
import { Branch } from '../branch/branch.entity';
import { CreateBranchDto } from '../branch/dto/create-branch.dto';
import { UpdateBranchDto } from '../branch/dto/update-branch.dto';
import { Company } from '../companies/company.entity';
import { userCompanyMapping } from 'src/entities/user-company-mapping.entity';
import { generateCode } from 'src/commonHelper/response.util';

@Injectable()
export class BranchService {
    constructor(
        @InjectRepository(Branch)
        private branchRepo: Repository<Branch>,
        @InjectRepository(Company)
        private companyRepo: Repository<Company>,
        @InjectRepository(userCompanyMapping)
        private ucm: Repository<userCompanyMapping>,
        private readonly dataSource: DataSource,

    ) { }

    async create(dto: CreateBranchDto, userID: number, companyID:number) {

        const company = await this.companyRepo.findOneBy({ id: dto.companyId });
        if (!company) return { success: false, message: `Company with ID ${dto.companyId} not found` };
    const branchCode = await generateCode('branch', 'BRN', this.dataSource);

        const branch = this.branchRepo.create({
            ...dto,
            company: { id: dto.companyId } as Company,
            branch_code:branchCode,
            is_active: 1,
        });
        const savedBranch = await this.branchRepo.save(branch);

        const findBranch = await this.ucm.findOne({ where: { user_id: userID } });



        if (!findBranch) {
            throw new Error('Company mapping not found');
        }

        // branch_id is already a number[] (auto-parsed by TypeORM JSON column)
        let updatedBranches: number[] = [...(findBranch.branch_id || [])];

        if (!updatedBranches.includes(savedBranch.id)) {
            updatedBranches.push(savedBranch.id);
        }

        // Update with array directly (TypeORM handles JSON serialization)
        await this.ucm.update(
            { user_id: userID },
            { branch_id: updatedBranches }
        );

        const branches = await this.findAll(userID);
        return { success: true, message: 'Branch created successfully', data: branches };
        try { } catch (error) {
            return { success: false, message: 'Failed to create branch' };
        }
    }

    async findAll(user_id: number) {
        const findBranches = await this.ucm.findOne({ where: { user_id } });

        if (!findBranches || !Array.isArray(findBranches.branch_id) || findBranches.branch_id.length === 0) {
            return { status: true, message: "No Branch Found", data: [] }
        }
        const branchIDS = findBranches.branch_id;
        const branch = await this.branchRepo
            .createQueryBuilder('branch')
            .leftJoin('branch.company', 'company')
            .andWhere('branch.is_active = :isActive', { isActive: 1 })
            .andWhere('branch.id IN (:...ids)', { ids: branchIDS })
            .select([
                'branch.id',
                'branch.branch_code as branch_code',
                'branch.branch_name as branch_name',
                'branch.branch_type as branch_type',
                'branch.address_line1 as address_line1',
                'branch.address_line2 as address_line2',
                'branch.city as city',
                'branch.state as state',
                'branch.country as country',
                'branch.postal_code as postal_code',
                'branch.phone as phone',
                'branch.mobile as mobile',
                'branch.email as email',
                'branch.manager_name as manager_name',
                'branch.manager_email  as manager_email',
                'branch.manager_phone as manager_phone',
                'branch.opening_balance as opening_balance',
                'branch.bank_account_no as bank_account_no',
                'branch.bank_name as bank_name',
                'branch.ifsc_code as ifsc_code',
                'branch.is_head_office as is_head_office',
                'branch.allow_negative_stock as allow_negative_stock',
                'branch.is_active as is_active',
                'branch.created_by as created_by',
                'branch.created_date as created_date',
                'branch.updated_by as updated_by',
                'branch.updated_date as updated_date',
                'company.id as companyId',
                'company.company_name as company_name',
            ])
            .getRawMany();
        return { status: true, message: "Get All Branches", data: branch }
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


    async update(id: number, dto: UpdateBranchDto, userID: number, compnayId: number) {
        try {
            const branch = await this.branchRepo.findOneBy({ id });
            if (!branch) return { success: false, message: 'Branch not found' };

            // If companyId is provided, fetch and assign the relation
            if (compnayId) {
                const company = await this.companyRepo.findOneBy({ id: compnayId });
                if (!company) {
                    return { success: false, message: 'Company not found' };
                }
                branch.company = { id: compnayId } as Company;
            }

            Object.assign(branch, dto);
            branch.updated_date = new Date().toISOString().split('T')[0];

            const updatedBranch = await this.branchRepo.save(branch);
            const branches = await this.findAll(userID);
            return { success: true, message: 'Branch updated successfully', data: branches };
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
