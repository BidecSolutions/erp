// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { SaturationDeduction } from './saturation-deduction.entity';
// import { CreateSaturationDeductionDto } from './dto/create-saturation-deduction.dto';
// import { UpdateSaturationDeductionDto } from './dto/update-saturation-deduction.dto';
// import { DeductionOption } from 'src/hrm/hrm_deduction-option/deduction-option.entity';

// @Injectable()
// export class SaturationDeductionService {
//   constructor(
//     @InjectRepository(SaturationDeduction)
//     private readonly deductionRepo: Repository<SaturationDeduction>,

//     @InjectRepository(DeductionOption)
//     private readonly optionRepo: Repository<DeductionOption>,
//   ) {}

//   async create(dto: CreateSaturationDeductionDto) {
//     const option = await this.optionRepo.findOneBy({ id: dto.deductionOption });
//     if (!option) throw new NotFoundException('Deduction option not found');

//     const newDeduction = this.deductionRepo.create({
//       title: dto.title,
//       type: dto.type,
//       amount: dto.amount,
//       deductionOption: option,
//     });

//     const saved = await this.deductionRepo.save(newDeduction);

//     return {
//       id: saved.id,
//       title: saved.title,
//       type: saved.type,
//       amount: saved.amount,
//       deductionOption: option.name,
//     };
//   }

//   async findAll() {
//     const records = await this.deductionRepo.find({ relations: ['deductionOption'] });
//     return records.map(r => ({
//       id: r.id,
//       title: r.title,
//       type: r.type,
//       amount: r.amount,
//       deductionOption: r.deductionOption?.name || null,
//     }));
//   }

//   async findOne(id: number) {
//     const record = await this.deductionRepo.findOne({ where: { id }, relations: ['deductionOption'] });
//     if (!record) throw new NotFoundException('Saturation Deduction not found');

//     return {
//       id: record.id,
//       title: record.title,
//       type: record.type,
//       amount: record.amount,
//       deductionOption: record.deductionOption?.name || null,
//     };
//   }

//   async update(id: number, dto: UpdateSaturationDeductionDto) {
//     const record = await this.deductionRepo.findOneBy({ id });
//     if (!record) throw new NotFoundException('Saturation Deduction not found');

//     if (dto.deductionOption) {
//       const option = await this.optionRepo.findOneBy({ id: dto.deductionOption });
//       if (!option) throw new NotFoundException('Deduction option not found');
//       record.deductionOption = option;
//     }

//     Object.assign(record, dto);
//     const updated = await this.deductionRepo.save(record);

//     return {
//       id: updated.id,
//       title: updated.title,
//       type: updated.type,
//       amount: updated.amount,
//       deductionOption: updated.deductionOption?.name || null,
//     };
//   }

//   async remove(id: number) {
//     const record = await this.deductionRepo.findOneBy({ id });
//     if (!record) throw new NotFoundException('Saturation Deduction not found');

//     await this.deductionRepo.remove(record);
//     return { message: `Saturation Deduction ID ${id} deleted successfully` };
//   }
// }
