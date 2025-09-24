import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Paysliptype } from './paysliptype.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePaysliptypeDto } from './dto/create-paysliptype.dto';
import { UpdatePaysliptypeDto } from './dto/update-paysliptype.dto';

@Injectable()
export class PaysliptypeService {
    constructor(
        @InjectRepository(Paysliptype)
        private paysliptypeRepository: Repository<Paysliptype>,
    ){}

    async create(dto: CreatePaysliptypeDto): Promise<Paysliptype> {
        const paysliptype = this.paysliptypeRepository.create(dto);
        return await this.paysliptypeRepository.save(paysliptype);
    }

    async findAll(): Promise<Paysliptype[]>{
        return await this.paysliptypeRepository.find();
    }

    async findOne(id:number): Promise<Paysliptype> {
        const paysliptype = await this.paysliptypeRepository.findOne({ where : {id}});
        if (!paysliptype) throw new NotFoundException(`PayslipType with ID ${id} not found`);
            return paysliptype;
    }

    async update(id:number , dto:UpdatePaysliptypeDto): Promise<Paysliptype> {
        const paysliptype = await this.findOne(id);
        Object.assign(paysliptype, dto);
        return await this.paysliptypeRepository.save(paysliptype);
    }

    async remove(id:number): Promise<{ message: string }> {
    const paysliptype = await this.findOne(id);
    await this.paysliptypeRepository.remove(paysliptype);
    return { message: `Branch with ID ${id} deleted successfully` };
    }
}
