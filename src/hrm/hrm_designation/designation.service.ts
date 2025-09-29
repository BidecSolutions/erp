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

  async create(dto: CreateDesignationDto): Promise<any> {
    const department = await this.departmentRepo.findOne({ where: { id: dto.departmentId } });
    if (!department) throw new NotFoundException(`Department with ID ${dto.departmentId} not found`);

    const designation = this.designationRepository.create({
      name: dto.name,
      department,
    });
    const saved = await this.designationRepository.save(designation);

    return {
      id: saved.id,
      name: saved.name,
      department: department.name, // sirf name
    };
  }

  async findAll(): Promise<any[]> {
    const designations = await this.designationRepository.find({
      relations: ['department'],
    });

    return designations.map(d => ({
      id: d.id,
      name: d.name,
      department: d.department?.name, // sirf name
    }));
  }

  async findOne(id: number): Promise<any> {
    const designation = await this.designationRepository.findOne({
      where: { id },
      relations: ['department'],
    });
    if (!designation) throw new NotFoundException(`Designation with ID ${id} not found`);

    return {
      id: designation.id,
      name: designation.name,
      department: designation.department?.name, // sirf name
    };
  }

  async update(id: number, dto: UpdateDesignationDto): Promise<any> {
    const designation = await this.designationRepository.findOne({
      where: { id },
      relations: ['department'],
    });
    if (!designation) throw new NotFoundException(`Designation with ID ${id} not found`);

    if (dto.departmentId) {
      const department = await this.departmentRepo.findOne({ where: { id: dto.departmentId } });
      if (!department) throw new NotFoundException(`Department with ID ${dto.departmentId} not found`);
      designation.department = department;
    }

    if (dto.name) {
      designation.name = dto.name;
    }

    const updated = await this.designationRepository.save(designation);

    return {
      id: updated.id,
      name: updated.name,
      department: updated.department?.name, // sirf name
    };
  }

  async remove(id: number): Promise<{ message: string }> {
    const designation = await this.designationRepository.findOne({ where: { id } });
    if (!designation) throw new NotFoundException(`Designation with ID ${id} not found`);
    await this.designationRepository.remove(designation);

    return { message: `Designation with ID ${id} deleted successfully` };
  }
}
