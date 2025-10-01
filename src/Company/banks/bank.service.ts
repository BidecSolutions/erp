import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bank } from './bank.entity';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';

@Injectable()
export class BankService {
    constructor(
        @InjectRepository(Bank)
        private bankRepo: Repository<Bank>,
    ) { }

    async create(dto: CreateBankDto) {
        try {
            const exists = await this.bankRepo.findOne({ where: { bank_name: dto.bank_name } });
            if (exists) {
                return { success: false, message: 'Bank name already exists' };
            }

            const bank = this.bankRepo.create(dto);
            await this.bankRepo.save(bank);
            return { success: true, message: 'Bank created successfully', data: bank };
        } catch (error) {
            return { success: false, message: 'Error creating bank', error };
        }
    }

    async findAll() {
        try {
            const banks = await this.bankRepo.find({ where: { status: 1 }, order: { id: 'DESC' } });
            return { success: true, data: banks };
        } catch (error) {
            return { success: false, message: 'Error fetching banks', error };
        }
    }

    async findOne(id: number) {
        try {
            const bank = await this.bankRepo.findOne({ where: { id, status: 1 } });
            if (!bank) {
                return { success: false, message: `Bank with ID ${id} not found` };
            }
            return { success: true, data: bank };
        } catch (error) {
            return { success: false, message: 'Error fetching bank', error };
        }
    }

    async update(id: number, dto: UpdateBankDto) {
        try {
            const bank = await this.bankRepo.findOne({ where: { id, status: 1 } });
            if (!bank) {
                return { success: false, message: `Bank with ID ${id} not found` };
            }

            Object.assign(bank, dto);
            await this.bankRepo.save(bank);

            return { success: true, message: 'Bank updated successfully', data: bank };
        } catch (error) {
            return { success: false, message: 'Error updating bank', error };
        }
    }

    async remove(id: number) {
        try {
            const bank = await this.bankRepo.findOne({ where: { id, status: 1 } });
            if (!bank) {
                return { success: false, message: `Bank with ID ${id} not found` };
            }

            bank.status = 0; // Soft delete
            await this.bankRepo.save(bank);

            return { success: true, message: 'Bank deleted (inactivated) successfully' };
        } catch (error) {
            return { success: false, message: 'Error deleting bank', error };
        }
    }
}
