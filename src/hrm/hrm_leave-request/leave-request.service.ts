import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveRequest, LeaveStatus } from './leave-request.entity';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { UpdateLeaveRequestDto } from './dto/update-leave-request.dto';
import { Employee } from '../hrm_employee/employee.entity';
import { LeaveType } from '../hrm_leave-type/leave-type.entity';
import { Notification } from '../hrm_notification/notification.entity';
import { AnnualLeave } from '../hrm_annual-leave/annual-leave.entity';
import { UnpaidLeave } from '../hrm_unpaid-leave/unpaid-leave.entity';
import { NotificationService } from '../hrm_notification/notification.service';

@Injectable()
export class LeaveRequestService {
  constructor(
    @InjectRepository(LeaveRequest)
    private readonly leaveRequestRepository: Repository<LeaveRequest>,

    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,

    @InjectRepository(LeaveType)
    private readonly leaveTypeRepository: Repository<LeaveType>,

     @InjectRepository(AnnualLeave)
    private annualLeaveRepository: Repository<AnnualLeave>, // 👈 ye inject

    @InjectRepository(UnpaidLeave)
    private unpaidLeaveRepository: Repository<UnpaidLeave>, // 👈 ye inject

    private readonly notificationService: NotificationService,

  ) {}

  // 🔹 Helper: format response
  private formatResponse(leaveRequest: LeaveRequest) {
    return {
      id: leaveRequest.id,
    employeeName: leaveRequest.employee.name,   // 👈 employee ka name
    leaveType: leaveRequest.leaveType.leave_type,    // 👈 leave type ka name
    number_of_leave: leaveRequest.number_of_leave,
    description: leaveRequest.description,
    start_date: leaveRequest.start_date,
    end_date: leaveRequest.end_date,
    leave_status: leaveRequest.leave_status,
    created_at: leaveRequest.created_at,
    updated_at: leaveRequest.updated_at,
    };
  }

  // 🔹 Create
async create(dto: CreateLeaveRequestDto) {
  const employee = await this.employeeRepository.findOneBy({ id: dto.emp_id });
  if (!employee) throw new NotFoundException('Employee not found');

  const leaveType = await this.leaveTypeRepository.findOneBy({ id: dto.leave_type_id });
  if (!leaveType) throw new NotFoundException('Leave type not found');

  const leaveRequest = this.leaveRequestRepository.create({
    employee: { id: dto.emp_id },
    leaveType: { id: dto.leave_type_id },
    number_of_leave: dto.number_of_leave,
    description: dto.description,
    start_date: dto.start_date,
    end_date: dto.end_date,
  });

  await this.leaveRequestRepository.save(leaveRequest);

  // 🔹 Load saved leave request with relations
const savedWithRelations = await this.leaveRequestRepository.findOne({
  where: { id: leaveRequest.id },
  relations: ['employee', 'leaveType'],
});

if (!savedWithRelations) {
  throw new NotFoundException('Leave request not found after save');
}

return this.formatResponse(savedWithRelations);
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
      relations: ['employee' , 'leaveType'],
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
  
async approveLeaveRequest(id: number) {
  // 🔹 Find leave request with employee relation
  const leaveRequest = await this.leaveRequestRepository.findOne({
    where: { id },
    relations: ['employee', 'leaveType'],
  });

  if (!leaveRequest) throw new NotFoundException(`Leave Request ID ${id} not found`);

  // 🔹 Load employee with annualLeave relation
  const employee = await this.employeeRepository.findOne({
    where: { id: leaveRequest.employee!.id },
    relations: ['annualLeave'],
  });


    if (leaveRequest.leave_status !== LeaveStatus.PENDING) {
    throw new BadRequestException('This leave request has already been processed.');
  }
  if (!employee) throw new NotFoundException('Employee not found');
if (!employee!.annualLeave) {
  throw new BadRequestException('Annual leave not assigned to this employee');
}


  // 🔹 Calculate already used leaves
  const usedLeaves = await this.leaveRequestRepository
  .createQueryBuilder('lr')
  .where('lr.employeeId = :empId', { empId: employee.id })
  .andWhere('lr.leave_status = :status', { status: LeaveStatus.APPROVED })
  .select('SUM(lr.number_of_leave)', 'total')
  .getRawOne();

const totalUsed = Number(usedLeaves.total) || 0;
const availableLeaves = employee.annualLeave.total_leave - totalUsed;
const requested = leaveRequest.number_of_leave;

if(requested <= availableLeaves) {
    // fully paid leave
} else {
    // partially paid + unpaid
    const paidDays = availableLeaves;
    const unpaidDays = requested - availableLeaves;
}


  if (leaveRequest.number_of_leave <= availableLeaves) {
    // 🔹 Enough leave → approve
    leaveRequest.leave_status = LeaveStatus.APPROVED;
    await this.leaveRequestRepository.save(leaveRequest);

  await this.notificationService.create({
  emp_id: employee.id,
  message: `Your leave request (${leaveRequest.number_of_leave} days) has been approved.`,
  notification_type_id: 1, // ye must, 1 = leave
});
  } else {
    // 🔹 Partial leave → approve paid + create unpaid leave
    const unpaidDays = leaveRequest.number_of_leave - availableLeaves;

    leaveRequest.leave_status = LeaveStatus.APPROVED;
    await this.leaveRequestRepository.save(leaveRequest);

    await this.unpaidLeaveRepository.save({
      employee: employee,
      leaveRequest: leaveRequest,
      extra_days: unpaidDays,
      status: 1,
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0],
    });

  await this.notificationService.create({
  emp_id: employee.id,
  message: `Your leave request (${leaveRequest.number_of_leave} days) has been approved.`,
  notification_type_id: 1, // 1 = leave
});

  }

  return { success: true, status: 'approved' };
}


async rejectLeaveRequest(id: number, reason: string) {
  const leaveRequest = await this.leaveRequestRepository.findOne({
    where: { id },
    relations: ['employee'],
  });

  if (!leaveRequest) throw new NotFoundException(`Leave Request ID ${id} not found`);
  if (leaveRequest.leave_status !== LeaveStatus.PENDING) {
    throw new BadRequestException('This leave request has already been processed.');
  }

  leaveRequest.leave_status = LeaveStatus.REJECTED;
  await this.leaveRequestRepository.save(leaveRequest);

  await this.notificationService.create({
    emp_id: leaveRequest.employee.id,
    message: `Your leave request has been rejected. Reason: ${reason}`,
    notification_type_id: 1,
  });

  return { success: true, status: 'rejected' };
}




}
