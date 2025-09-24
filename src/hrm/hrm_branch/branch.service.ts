// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Branch } from './branch.entity';
// import { CreateBranchDto } from './dto/create-branch.dto';
// import { UpdateBranchDto } from './dto/update-branch.dto';

// @Injectable()
// export class BranchService {
//   constructor(
//     @InjectRepository(Branch)
//     private branchRepository: Repository<Branch>,
//   ) {}

//   async create(dto: CreateBranchDto): Promise<Branch> {
//     const branch = this.branchRepository.create(dto);
//     return await this.branchRepository.save(branch);
//   }

//   async findAll(): Promise<Branch[]> {
//     return await this.branchRepository.find({
//         order: {
//             id: 'ASC',
//         }
//     });
//   }

//   async findOne(id: number): Promise<Branch> {
//     const branch = await this.branchRepository.findOne({ where: { id } });
//     if (!branch) throw new NotFoundException(`Branch with ID ${id} not found`);
//     return branch;
//   }

//   async update(id: number, dto: UpdateBranchDto): Promise<Branch> {
//     const branch = await this.findOne(id);
//     Object.assign(branch, dto);
//     return await this.branchRepository.save(branch);
//   }

//   async remove(id: number): Promise<{ message: string }> {
//     const branch = await this.findOne(id);
//     await this.branchRepository.remove(branch);
//     return { message: `Branch with ID ${id} deleted successfully` };
//   }
// }
