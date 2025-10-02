import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LeaveRequest, LeaveStatus } from "./leave-request.entity";
import { CreateLeaveRequestDto } from "./dto/create-leave-request.dto";
import { UpdateLeaveRequestDto } from "./dto/update-leave-request.dto";
import { Employee, EmployeeType } from "../hrm_employee/employee.entity";
import { LeaveType } from "../hrm_leave-type/leave-type.entity";
import { Notification } from "../hrm_notification/notification.entity";
import { AnnualLeave } from "../hrm_annual-leave/annual-leave.entity";
import { UnpaidLeave } from "../hrm_unpaid-leave/unpaid-leave.entity";
import { NotificationService } from "../hrm_notification/notification.service";
import { ProbationSetting } from "../hrm_probation-setting/probation-setting.entity";
import {
  errorResponse,
  toggleStatusResponse,
} from "src/commonHelper/response.util";

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
    @InjectRepository(ProbationSetting) // ← add this
    private readonly probationSettingRepo: Repository<ProbationSetting> // ← add this
  ) {}

  // Helper: format response
  private formatResponse(leaveRequest: LeaveRequest) {
    return {
      id: leaveRequest.id,
      employeeName: leaveRequest.employee.name, // 👈 employee ka name
      leaveType: leaveRequest.leaveType.leave_type, // 👈 leave type ka name
      number_of_leave: leaveRequest.number_of_leave,
      description: leaveRequest.description,
      start_date: leaveRequest.start_date,
      end_date: leaveRequest.end_date,
      leave_status: leaveRequest.leave_status,
      status: leaveRequest.status,
    };
  }

  // Create
  async create(dto: CreateLeaveRequestDto) {
    const employee = await this.employeeRepository.findOneBy({
      id: dto.emp_id,
    });
    if (!employee) throw new NotFoundException("Employee not found");

    const leaveType = await this.leaveTypeRepository.findOneBy({
      id: dto.leave_type_id,
    });
    if (!leaveType) throw new NotFoundException("Leave type not found");

    const leaveRequest = this.leaveRequestRepository.create({
      employee: { id: dto.emp_id },
      leaveType: { id: dto.leave_type_id },
      number_of_leave: dto.number_of_leave,
      description: dto.description,
      start_date: dto.start_date,
      end_date: dto.end_date,
    });

    await this.leaveRequestRepository.save(leaveRequest);

    // Load saved leave request with relations
    const savedWithRelations = await this.leaveRequestRepository.findOne({
      where: { id: leaveRequest.id },
      relations: ["employee", "leaveType"],
    });

    if (!savedWithRelations) {
      throw new NotFoundException("Leave request not found after save");
    }

return {
  success: true,
  message: 'Loan Request created successfully',
  data: this.formatResponse(savedWithRelations),
};  }

  // Find All
  async findAll(filterStatus?: number) {
    const status = filterStatus !== undefined ? filterStatus : 1;
    const leaveRequests = await this.leaveRequestRepository.find({
      where: { status },
      relations: ["employee", "leaveType"],
    });
    return leaveRequests.map((lr) => this.formatResponse(lr));
  }

  // Find One
  async findOne(id: number) {
    const lr = await this.leaveRequestRepository.findOne({
      where: { id },
      relations: ["employee", "leaveType"],
    });
    if (!lr) throw new NotFoundException("Leave request not found");
    return this.formatResponse(lr);
  }

  // Update
  async update(id: number, dto: UpdateLeaveRequestDto) {
    const lr = await this.leaveRequestRepository.findOne({
      where: { id },
      relations: ["employee", "leaveType"],
    });
    if (!lr) throw new NotFoundException("Leave request not found");

    if (dto.emp_id) {
      const employee = await this.employeeRepository.findOneBy({
        id: dto.emp_id,
      });
      if (!employee) throw new NotFoundException("Employee not found");
      lr.employee = employee;
    }

    if (dto.leave_type_id) {
      const leaveType = await this.leaveTypeRepository.findOneBy({
        id: dto.leave_type_id,
      });
      if (!leaveType) throw new NotFoundException("Leave type not found");
      lr.leaveType = leaveType;
    }

    Object.assign(lr, dto);
    const updated = await this.leaveRequestRepository.save(lr);
   return {
  success: true,
  message: 'Loan Request updated successfully',
  data: this.formatResponse(updated),
};
  }

  async statusUpdate(id: number) {
    try {
      const lr = await this.leaveRequestRepository.findOneBy({ id });
      if (!lr) throw new NotFoundException("Leave request not found");

      lr.status = lr.status === 0 ? 1 : 0;
      await this.leaveRequestRepository.save(lr);

      return toggleStatusResponse("Leave Request", lr.status);
    } catch (err) {
      return errorResponse("Something went wrong", err.message);
    }
  }

  // async approveLeaveRequest(id: number) {
  //   // Fetch leave request with employee + leaveType
  //   const leaveRequest = await this.leaveRequestRepository.findOne({
  //     where: { id },
  //     relations: ['employee', 'leaveType'],
  //   });

  //   if (!leaveRequest) throw new NotFoundException(`Leave Request ID ${id} not found`);
  //   if (leaveRequest.leave_status !== LeaveStatus.PENDING) {
  //     throw new BadRequestException('This leave request has already been processed.');
  //   }

  //   // Fetch employee with annualLeave
  //   const employee = await this.employeeRepository.findOne({
  //     where: { id: leaveRequest.employee.id },
  //     relations: ['annualLeave'],
  //   });
  //   if (!employee) throw new NotFoundException('Employee not found');

  //   let availableLeaves = 0;

  //   if (employee.emp_type === EmployeeType.PERMANENT) {
  //     if (!employee.annualLeave) {
  //       throw new BadRequestException('Annual leave not assigned to this employee');
  //     }

  //     const usedLeaves = await this.leaveRequestRepository
  //       .createQueryBuilder('lr')
  //       .where('lr.employeeId = :empId', { empId: employee.id })
  //       .andWhere('lr.leave_status = :status', { status: LeaveStatus.APPROVED })
  //       .andWhere('lr.id != :leaveRequestId', { leaveRequestId: id }) // 👈 avoid counting current
  //       .select('SUM(lr.number_of_leave)', 'total')
  //       .getRawOne();

  //     const totalUsed = Number(usedLeaves.total) || 0;
  //     availableLeaves = employee.annualLeave.total_leave - totalUsed;

  //   } else if (employee.emp_type === EmployeeType.PROBATION) {
  //     const probationSetting = await this.probationSettingRepo.findOneBy({ id: employee.probation_setting_id });
  //     if (!probationSetting) throw new BadRequestException('Probation leave setting not assigned to this employee');

  //     availableLeaves = probationSetting.leave_days || 0;

  //     const usedProbLeaves = await this.leaveRequestRepository
  //       .createQueryBuilder('lr')
  //       .where('lr.employeeId = :empId', { empId: employee.id })
  //       .andWhere('lr.leave_status = :status', { status: LeaveStatus.APPROVED })
  //       .andWhere('lr.id != :leaveRequestId', { leaveRequestId: id }) // 👈 avoid counting current
  //       .select('SUM(lr.number_of_leave)', 'total')
  //       .getRawOne();

  //     const totalUsed = Number(usedProbLeaves.total) || 0;
  //     availableLeaves = availableLeaves - totalUsed;
  //   }

  //   const requested = leaveRequest.number_of_leave;

  //   if (requested <= availableLeaves) {
  //     leaveRequest.leave_status = LeaveStatus.APPROVED;
  //     await this.leaveRequestRepository.save(leaveRequest);

  //     await this.notificationService.create({
  //       emp_id: employee.id,
  //       message: `Your leave request (${requested} days) has been approved.`,
  //       notification_type_id: 1,
  //     });

  //   } else {
  //     const unpaidDays = requested - availableLeaves;

  //     leaveRequest.leave_status = LeaveStatus.APPROVED;
  //     await this.leaveRequestRepository.save(leaveRequest);

  //     await this.unpaidLeaveRepository.save({
  //       employee,
  //       leaveRequest,
  //       unpain_days: unpaidDays,
  //       start_date: leaveRequest.start_date,
  //       end_date: leaveRequest.end_date,
  //       status: 1,
  //       created_at: new Date().toISOString().split('T')[0],
  //       updated_at: new Date().toISOString().split('T')[0],
  //     });

  //     await this.notificationService.create({
  //       emp_id: employee.id,
  //       message: `Your leave request (${requested} days) has been approved. ${unpaidDays} day(s) will be unpaid.`,
  //       notification_type_id: 1,
  //     });
  //   }

  //   return { success: true, status: 'approved' };
  // }
  async approveLeaveRequest(id: number) {
    // // Fetch leave request + employee + annualLeave + leaveType
    const leaveRequest = await this.leaveRequestRepository.findOne({
      where: { id },
      relations: ["employee", "employee.annualLeave", "leaveType"],
    });

    if (!leaveRequest)
      throw new NotFoundException(`Leave Request ID ${id} not found`);
    if (leaveRequest.leave_status !== LeaveStatus.PENDING) {
      throw new BadRequestException(
        "This leave request has already been processed."
      );
    }

    const employee = leaveRequest.employee;
    if (!employee) throw new NotFoundException("Employee not found");

    let availableLeaves = 0;

    // // Case 1: Permanent Employee
    if (employee.emp_type === EmployeeType.PERMANENT) {
      if (!employee.annualLeave) {
        throw new BadRequestException(
          "Annual leave not assigned to this employee"
        );
      }

      const usedLeaves = await this.leaveRequestRepository
        .createQueryBuilder("lr")
        .where("lr.employeeId = :empId", { empId: employee.id })
        .andWhere("lr.leave_status = :status", { status: LeaveStatus.APPROVED })
        .andWhere("lr.id != :leaveRequestId", { leaveRequestId: id }) // avoid current request
        .select("SUM(lr.number_of_leave)", "total")
        .getRawOne();

      const totalUsed = Number(usedLeaves.total) || 0;
      availableLeaves = employee.annualLeave.total_leave - totalUsed;
    }

    // // Case 2: Probation Employee
    else if (employee.emp_type === EmployeeType.PROBATION) {
      const probationSetting = await this.probationSettingRepo.findOneBy({
        id: employee.probation_setting_id,
      });
      if (!probationSetting)
        throw new BadRequestException(
          "Probation leave setting not assigned to this employee"
        );

      availableLeaves = probationSetting.leave_days || 0;

      const usedProbLeaves = await this.leaveRequestRepository
        .createQueryBuilder("lr")
        .where("lr.employeeId = :empId", { empId: employee.id })
        .andWhere("lr.leave_status = :status", { status: LeaveStatus.APPROVED })
        .andWhere("lr.id != :leaveRequestId", { leaveRequestId: id }) // avoid current request
        .select("SUM(lr.number_of_leave)", "total")
        .getRawOne();

      const totalUsed = Number(usedProbLeaves.total) || 0;
      availableLeaves -= totalUsed;
    }

    // // Check requested leaves
    const requested = leaveRequest.number_of_leave;

    if (requested <= availableLeaves) {
      // ✅ Enough leaves → Approve
      leaveRequest.leave_status = LeaveStatus.APPROVED;
      await this.leaveRequestRepository.save(leaveRequest);

      await this.notificationService.create({
        emp_id: employee.id,
        message: `Your leave request (${requested} days) has been approved.`,
        notification_type_id: 1,
      });
    } else {
      // ✅ Extra → Approve + mark unpaid
      const unpaidDays = requested - availableLeaves;

      leaveRequest.leave_status = LeaveStatus.APPROVED;
      await this.leaveRequestRepository.save(leaveRequest);

      await this.unpaidLeaveRepository.save({
        employee,
        leaveRequest,
        unpain_days: unpaidDays,
        start_date: leaveRequest.start_date,
        end_date: leaveRequest.end_date,
        status: 1,
        created_at: new Date().toISOString().split("T")[0],
        updated_at: new Date().toISOString().split("T")[0],
      });

      await this.notificationService.create({
        emp_id: employee.id,
        message: `Your leave request (${requested} days) has been approved. ${unpaidDays} day(s) will be unpaid.`,
        notification_type_id: 1,
      });
    }

    return { success: true, status: "approved" };
  }

  async rejectLeaveRequest(id: number, reason: string) {
    // Fetch leave request with employee
    const leaveRequest = await this.leaveRequestRepository.findOne({
      where: { id },
      relations: ["employee"],
    });

    if (!leaveRequest)
      throw new NotFoundException(`Leave Request ID ${id} not found`);
    if (leaveRequest.leave_status !== LeaveStatus.PENDING) {
      throw new BadRequestException(
        "This leave request has already been processed."
      );
    }

    leaveRequest.leave_status = LeaveStatus.REJECTED;
    await this.leaveRequestRepository.save(leaveRequest);

    await this.notificationService.create({
      emp_id: leaveRequest.employee.id,
      message: `Your leave request has been rejected. Reason: ${reason}`,
      notification_type_id: 1,
    });

    return { success: true, status: "rejected" };
  }
}
