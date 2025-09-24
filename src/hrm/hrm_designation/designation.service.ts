import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Designation } from './designation.entity';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { Department } from '../hrm_department/department.entity';

@Injectable()
export class DesignationService {
  constructor(
    @InjectRepository(Designation)
    private designationRepository: Repository<Designation>,
    @InjectRepository(Department)
    private departmentRepo: Repository<Department>,
  ) {}

  async create(dto: CreateDesignationDto): Promise<Designation> {
    const department = await this.departmentRepo.findOne({ where: { id: dto.departmentId } });
    if (!department) throw new NotFoundException(`Department with ID ${dto.departmentId} not found`);

    const designation = this.designationRepository.create({ name: dto.name, department });
    return await this.designationRepository.save(designation);
  }

  async findAll(): Promise<Designation[]> {
    return await this.designationRepository.find();
  }

  async findOne(id: number): Promise<Designation> {
    const designation = await this.designationRepository.findOne({ where: { id } });
    if (!designation) throw new NotFoundException(`Designation with ID ${id} not found`);
    return designation;
  }

  async update(id: number, dto: UpdateDesignationDto): Promise<Designation> {
    const designation = await this.findOne(id);

    if (dto.departmentId) {
      const department = await this.departmentRepo.findOne({ where: { id: dto.departmentId } });
      if (!department) throw new NotFoundException(`Department with ID ${dto.departmentId} not found`);
      designation.department = department;
    }

    if (dto.name) {
      designation.name = dto.name;
    }

    return await this.designationRepository.save(designation);
  }

  async remove(id: number): Promise<{ message: string }> {
    const designation = await this.findOne(id);
    await this.designationRepository.remove(designation);
    return { message: `Designation with ID ${id} deleted successfully` };
  }
}
