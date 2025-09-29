import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveRequest } from './leave-request.entity';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { UpdateLeaveRequestDto } from './dto/update-leave-request.dto';
import { Employee } from '../hrm_employee/employee.entity';
import { LeaveType } from '../hrm_leave-type/leave-type.entity';

@Injectable()
export class LeaveRequestService {
  constructor(
    @InjectRepository(LeaveRequest)
    private readonly leaveRequestRepository: Repository<LeaveRequest>,

    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,

    @InjectRepository(LeaveType)
    private readonly leaveTypeRepository: Repository<LeaveType>,
  ) {}

  // 🔹 Helper: format response
  private formatResponse(lr: LeaveRequest) {
    return {
      id: lr.id,
      employeeName: lr.employee?.name,
      leaveType: lr.leaveType?.leave_type,
      number_of_leave: lr.number_of_leave,
      description: lr.description,
      start_date: lr.start_date,
      end_date: lr.end_date,
      leave_status: lr.leave_status,
      created_at: lr.created_at,
      updated_at: lr.updated_at,
    };
  }

  // 🔹 Create
  async create(dto: CreateLeaveRequestDto) {
    const employee = await this.employeeRepository.findOneBy({ id: dto.emp_id });
    if (!employee) throw new NotFoundException('Employee not found');

    const leaveType = await this.leaveTypeRepository.findOneBy({ id: dto.leave_type_id });
    if (!leaveType) throw new NotFoundException('Leave type not found');

    const leaveRequest = this.leaveRequestRepository.create({
      ...dto,
      employee,
      leaveType,
    });

    const saved = await this.leaveRequestRepository.save(leaveRequest);
    return this.formatResponse(saved);
  }

  // 🔹 Find All
  async findAll() {
    const leaveRequests = await this.leaveRequestRepository.find({
      relations: ['employee', 'leaveType'],
    });
    return leaveRequests.map((lr) => this.formatResponse(lr));
  }

  // 🔹 Find One
  async findOne(id: number) {
    const lr = await this.leaveRequestRepository.findOne({
      where: { id },
      relations: ['employee', 'leaveType'],
    });
    if (!lr) throw new NotFoundException('Leave request not found');
    return this.formatResponse(lr);
  }

  // 🔹 Update
  async update(id: number, dto: UpdateLeaveRequestDto) {
    const lr = await this.leaveRequestRepository.findOne({
      where: { id },
      relations: ['employee', 'leaveType'],
    });
    if (!lr) throw new NotFoundException('Leave request not found');

    if (dto.emp_id) {
      const employee = await this.employeeRepository.findOneBy({ id: dto.emp_id });
      if (!employee) throw new NotFoundException('Employee not found');
      lr.employee = employee;
    }

    if (dto.leave_type_id) {
      const leaveType = await this.leaveTypeRepository.findOneBy({ id: dto.leave_type_id });
      if (!leaveType) throw new NotFoundException('Leave type not found');
      lr.leaveType = leaveType;
    }

    Object.assign(lr, dto);
    const updated = await this.leaveRequestRepository.save(lr);
    return this.formatResponse(updated);
  }

  // 🔹 Delete
  async remove(id: number) {
    const lr = await this.leaveRequestRepository.findOneBy({ id });
    if (!lr) throw new NotFoundException('Leave request not found');
    await this.leaveRequestRepository.delete(id);
    return { message: 'Leave request deleted successfully' };
  }
}
