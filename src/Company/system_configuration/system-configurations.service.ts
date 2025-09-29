import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemConfiguration } from './system_configuration.entity';
import { CreateSystemConfigurationDto } from './dto/create-system-configuration.dto';
import { UpdateSystemConfigurationDto } from './dto/update-system-configuration.dto';
import { Company } from '../companies/company.entity';

@Injectable()
export class SystemConfigurationsService {
    constructor(
        @InjectRepository(SystemConfiguration)
        private readonly configRepo: Repository<SystemConfiguration>,
        @InjectRepository(Company)
        private readonly companyRepo: Repository<Company>,
    ) { }

    async create(dto: CreateSystemConfigurationDto) {
        try {
            const company = await this.companyRepo.findOne({ where: { id: dto.company_id } });
            if (!company) {
                return { success: false, message: `Company with ID ${dto.company_id} not found` };
            }

            // validation for recurring fields
            if (dto.is_recurring === 1) {
                if (!dto.recurring_date || !dto.recurring_amount) {
                    return { success: false, message: 'recurring_date and recurring_amount are required when is_recurring = 1' };
                }
            }

            const config = this.configRepo.create({
                ...dto,
                company: { id: dto.company_id } as Company,
                status: 1,
            });
            const saved = await this.configRepo.save(config);
            return { success: true, message: 'System configuration created successfully', data: saved };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    async findAll() {
        return await this.configRepo.find({
            where: { status: 1 },
            relations: ['company'],
            select: {
                id: true,
                is_recurring: true,
                recurring_date: true,
                recurring_amount: true,
                facebook_link: true,
                youtube_link: true,
                linkdin_link: true,
                company: { id: true, company_name: true }
            },
            order: { id: 'DESC' },
        });
    }

    async findOne(id: number) {
        return await this.configRepo.findOne({
            where: { id, status: 1 }, relations: ['company'],
            select: {
                id: true,
                is_recurring: true,
                recurring_date: true,
                recurring_amount: true,
                facebook_link: true,
                youtube_link: true,
                linkdin_link: true,
                company: { id: true, company_name: true }
            },
        });
    }

    async update(id: number, dto: UpdateSystemConfigurationDto) {
        try {
            const config = await this.configRepo.findOne({
                where: { id, status: 1 }, relations: ['company'],
                select: {
                    company: { id: true, company_name: true }
                }
            });
            if (!config) {
                return { success: false, message: `System configuration with ID ${id} not found` };
            }

            if (dto.is_recurring === 1) {
                if (!dto.recurring_date || !dto.recurring_amount) {
                    return { success: false, message: 'recurring_date and recurring_amount are required when is_recurring = 1' };
                }
            }

            Object.assign(config, dto);

            const updated = await this.configRepo.save(config);
            return { success: true, message: 'System configuration updated successfully', data: updated };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    async delete(id: number) {
        try {
            const config = await this.configRepo.findOne({ where: { id } });
            if (!config) {
                return { success: false, message: `System configuration with ID ${id} not found` };
            }
             config.status = 0;
            await this.configRepo.remove(config);
            return { success: true, message: 'System configuration soft-deleted successfully',
                 data: config };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}
