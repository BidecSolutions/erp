import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Department } from '../hrm_department/department.entity';
import { Designation } from '../hrm_designation/designation.entity';
import { BankDetailService } from '../hrm_bank-details/bank-details.service';
import { BankDetail } from '../hrm_bank-details/bank-detail.entity';
import { Shift } from '../hrm_shift/shift.entity';
import { DocumentService } from '../hrm_document/document.service';
// import { Leave } from '../hrm_leave/leave.entity';
// import { LeaveService } from '../hrm_leave/leave.service';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(Designation)
    private designationRepository: Repository<Designation>,
    private readonly bankDetailService: BankDetailService,
    @InjectRepository(Shift) private shiftRepository: Repository<Shift>,
    private readonly documentService: DocumentService,
    // private readonly leaveService: LeaveService,
  ) {}

  private async generateEmployeeCode(): Promise<string> {
    const lastEmployee = await this.employeeRepository.find({
      order: { id: 'DESC' },
      take: 1,
    });
    const newId = lastEmployee.length > 0 ? lastEmployee[0].id + 1 : 1;
    return `EMP-${String(newId).padStart(3, '0')}`;
  }

  async findAll() {
    const employees = await this.employeeRepository.find({
      relations: ['department', 'designation', 'documents', 'bankDetails'],
    });

    return employees.map((emp) => ({
      ...emp,
      department: emp.department?.name || null,
      designation: emp.designation?.name || null,
      documents: emp.documents || [],
      bankDetails: emp.bankDetails || [],
    }));
  }

  async findOne(id: number) {
    const emp = await this.employeeRepository.findOne({
      where: { id },
      relations: ['department', 'designation', 'documents', 'bankDetails'],
    });
    if (!emp) throw new NotFoundException(`Employee ID ${id} not found`);

    return {
      ...emp,
      department: emp.department?.name || null,
      designation: emp.designation?.name || null,
      documents: emp.documents || [],
      bankdetails: emp.bankDetails || [],
    };
  }

  async create(
    dto: CreateEmployeeDto,
    files?: { cv?: Express.Multer.File[]; photo?: Express.Multer.File[] },
  ) {
    const department = await this.departmentRepository.findOneBy({
      id: dto.departmentId,
    });
    const designation = await this.designationRepository.findOneBy({
      id: dto.designationId,
    });
    const shift = await this.shiftRepository.findOneBy({ id: dto.shiftId });

    if (!department) throw new NotFoundException('Department not found');
    if (!designation) throw new NotFoundException('Designation not found');
    if (!shift) throw new NotFoundException('Shift not found');

    const emp = this.employeeRepository.create({
      ...dto,
      department,
      designation,
      shift,
    });

    emp.is_system_user = dto.is_system_user ?? true;
    if (!dto.is_system_user) {
      emp.email = undefined;
      emp.password = undefined;
    }

    emp.employeeCode = await this.generateEmployeeCode();
    const saved = await this.employeeRepository.save(emp);

    // assign leave if leaveId is provided
    // if (dto.leaveId) {
    //   const leave = await this.leaveService.findById(dto.leaveId);
    //   saved.leave = leave;
    //   await this.employeeRepository.save(saved);
    // }

    // save documents
    if (files && Object.keys(files).length > 0) {
      await this.documentService.createMany(saved.id, files);
    }

    //  Save bank details agar aayein
    if (dto.bankDetails && dto.bankDetails.length > 0) {
      await this.bankDetailService.createMany(saved.id, dto.bankDetails);
    }

    // Dobara fetch kar ke sirf names return karenge
    const fullEmp = await this.employeeRepository.findOne({
      where: { id: saved.id },
      relations: ['department', 'designation', 'shift'],
    });

    if (!fullEmp) throw new NotFoundException('Employee not found after save');

    return {
      ...saved,
      department: fullEmp.department.name,
      designation: fullEmp.designation.name,
      shift: fullEmp.shift.name,
    };
  }

  async update(
    id: number,
    dto: UpdateEmployeeDto,
    files?: { cv?: Express.Multer.File[]; photo?: Express.Multer.File[] },
  ) {
    const emp = await this.employeeRepository.findOne({
      where: { id },
      relations: ['department', 'designation', 'shift'],
    });
    if (!emp) throw new NotFoundException(`Employee ID ${id} not found`);

    if (dto.departmentId) {
      const department = await this.departmentRepository.findOneBy({
        id: dto.departmentId,
      });
      if (!department) throw new NotFoundException('Department not found');
      emp.department = department;
    }

    if (dto.designationId) {
      const designation = await this.designationRepository.findOneBy({
        id: dto.designationId,
      });
      if (!designation) throw new NotFoundException('Designation not found');
      emp.designation = designation;
    }

    if (dto.shiftId) {
      const shift = await this.shiftRepository.findOneBy({ id: dto.shiftId });
      if (!shift) throw new NotFoundException('Shift not found');
      emp.shift = shift;
    }

    Object.assign(emp, dto);

    if (!dto.is_system_user) {
      // Agar system user nahi hai, email/password hata do
      emp.email = undefined;
      emp.password = undefined;
    }

    const saved = await this.employeeRepository.save(emp);

    //Dobara fetch kar ke sirf names return karenge
    const fullEmp = await this.employeeRepository.findOne({
      where: { id: saved.id },
      relations: ['department', 'designation', 'shift'],
    });

    if (!fullEmp) throw new NotFoundException('Employee not found after save');

    return {
      ...saved,
      department: fullEmp.department.name,
      designation: fullEmp.designation.name,
      Shift: fullEmp.shift.name,
    };
  }

  async remove(id: number) {
    const emp = await this.employeeRepository.findOneBy({ id });
    if (!emp) throw new NotFoundException(`Employee ID ${id} not found`);
    await this.employeeRepository.remove(emp);
    return { message: `Employee ID ${id} deleted successfully` };
  }
}
