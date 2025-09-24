// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Overtime } from './overtime.entity';
// import { CreateOvertimeDto } from './dto/create-overtime.dto';
// import { UpdateOvertimeDto } from './dto/update-overtime.dto';

// @Injectable()
// export class OvertimeService {
//   constructor(
//     @InjectRepository(Overtime)
//     private readonly overtimeRepo: Repository<Overtime>,
//   ) {}

//   async create(dto: CreateOvertimeDto): Promise<Overtime> {
//     const overtime = this.overtimeRepo.create(dto);
//     return await this.overtimeRepo.save(overtime);
//   }

//   async findAll(): Promise<Overtime[]> {
//     return this.overtimeRepo.find();
//   }

//   async findOne(id: number): Promise<Overtime> {
//     const overtime = await this.overtimeRepo.findOne({ where: { id } });
//     if (!overtime) throw new NotFoundException('Overtime record not found');
//     return overtime;
//   }

//   async update(id: number, dto: UpdateOvertimeDto): Promise<Overtime> {
//     const overtime = await this.findOne(id);
//     Object.assign(overtime, dto);
//     return this.overtimeRepo.save(overtime);
//   }

//   async remove(id: number): Promise<void> {
//     const overtime = await this.findOne(id);
//     await this.overtimeRepo.remove(overtime);
//   }
// }
