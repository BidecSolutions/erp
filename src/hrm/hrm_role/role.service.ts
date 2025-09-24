// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Role } from './role.entity';
// import { CreateRoleDto } from './dto/create-role.dto';
// import { UpdateRoleDto } from './dto/update-role.dto';

// @Injectable()
// export class RoleService {
//   constructor(
//     @InjectRepository(Role)
//     private roleRepository: Repository<Role>,
//   ) {}

//   async create(dto: CreateRoleDto): Promise<Role> {
//     const role = this.roleRepository.create(dto);
//     return await this.roleRepository.save(role);
//   }

//   async findAll(): Promise<Role[]> {
//     return await this.roleRepository.find();
//   }

//   async findOne(id: number): Promise<Role> {
//     const role = await this.roleRepository.findOne({ where: { id } });
//     if (!role) throw new NotFoundException(`Role with ID ${id} not found`);
//     return role;
//   }

//   async update(id: number, dto: UpdateRoleDto): Promise<Role> {
//     const role = await this.findOne(id);
//     Object.assign(role, dto);
//     return await this.roleRepository.save(role);
//   }

//   async remove(id: number): Promise<{ message: string }> {
//     const role = await this.findOne(id);
//     await this.roleRepository.remove(role);
//     return { message: `Role with ID ${id} deleted successfully` };
//   }
// }
