import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LoanRequest, LoanStatus } from "./loan-request.entity";
import { Employee } from "../hrm_employee/employee.entity";
import { CreateLoanRequestDto } from "./dto/create-loan-request.dto";
import { UpdateLoanRequestDto } from "./dto/update-loan-request.dto";
import { NotificationService } from "../hrm_notification/notification.service";
import {
  errorResponse,
  toggleStatusResponse,
} from "src/commonHelper/response.util";

@Injectable()
export class LoanRequestService {
  constructor(
    @InjectRepository(LoanRequest)
    private readonly loanRequestRepository: Repository<LoanRequest>,

    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,

    private readonly notificationService: NotificationService
  ) {}

  // Helper to format response
  // // Format Response
  formatResponse(loan: LoanRequest) {
    return {
      id: loan.id,
      // employeeName: loan.employee?.name || null,
      emp_id: loan.emp_id,
      amount: loan.amount,
      description: loan.description,
      loan_status: loan.loan_status,
      status: loan.status,
      // created_at: loan.created_at,
      // updated_at: loan.updated_at,
    };
  }

  // Find all
  async findAll(filterStatus?: number) {
      const status = filterStatus !== undefined ? filterStatus : 1;
    const loans = await this.loanRequestRepository.find({
       where: { status },
      relations: ["employee"],
    });
    return loans.map((l) => this.formatResponse(l));
  }

  // Find one
  async findOne(id: number) {
    const loan = await this.loanRequestRepository.findOne({
      where: { id },
      relations: ["employee"],
    });
    if (!loan) throw new NotFoundException("Loan request not found");
    return this.formatResponse(loan);
  }

  // Create Loan Request
  async create(dto: CreateLoanRequestDto) {
    //  Employee check
    const employee = await this.employeeRepository.findOne({
      where: { id: dto.emp_id },
    });
    if (!employee) throw new NotFoundException("Employee not found");

    //  Loan create & save
    const loan = this.loanRequestRepository.create({
      ...dto,
      loan_status: LoanStatus.PENDING,
    });
    await this.loanRequestRepository.save(loan);

    //  Reload loan with employee relation
    const loanWithEmployee = await this.loanRequestRepository.findOne({
      where: { id: loan.id },
      relations: ["employee"],
    });

    if (!loanWithEmployee) {
      throw new NotFoundException("Loan request not found after save");
    }

    //  Format response safely
    return {
      success: true,
      message: "Loan Request created successfully",
      data: this.formatResponse(loanWithEmployee),
    };
  }

  // // Update Loan Request
  async update(id: number, dto: UpdateLoanRequestDto) {
    const loan = await this.loanRequestRepository.findOne({
      where: { id },
      relations: ["employee"],
    });
    if (!loan) throw new NotFoundException("Loan request not found");

    Object.assign(loan, dto);
    const updated = await this.loanRequestRepository.save(loan);
    return {
      success: true,
      message: "Loan Request updated successfully",
      data: this.formatResponse(updated),
    };
  }

  // // Approve Loan Request
  async approveLoanRequest(id: number) {
    const loan = await this.loanRequestRepository.findOne({
      where: { id },
      relations: ["employee"],
    });
    if (!loan) throw new NotFoundException("Loan request not found");

    if (loan.loan_status !== LoanStatus.PENDING)
      throw new BadRequestException(
        "This loan request has already been processed."
      );

    const employee = loan.employee;
    if (!employee) throw new NotFoundException("Employee not found");

    const salary = employee.fixedSalary ?? 0;
    if (salary <= 0)
      throw new BadRequestException("Employee salary not assigned");

    // Previous approved loans
    const totalApprovedRaw = await this.loanRequestRepository
      .createQueryBuilder("lr")
      .where("lr.emp_id = :empId", { empId: employee.id })
      .andWhere("lr.loan_status = :status", { status: LoanStatus.APPROVED })
      .select("SUM(lr.amount)", "total")
      .getRawOne();

    const totalApproved = Number(totalApprovedRaw.total) || 0;

    if (totalApproved + loan.amount > salary) {
      throw new BadRequestException("Loan amount exceeds employee salary");
    }

    //  Approve
    loan.loan_status = LoanStatus.APPROVED;
    await this.loanRequestRepository.save(loan);

    await this.notificationService.create({
      emp_id: employee.id,
      message: `Your loan request of ${loan.amount} has been approved.`,
      notification_type_id: 2,
      // module type add
    });

    return { success: true, status: "approved" };
  }

  // // Reject Loan Request
  async rejectLoanRequest(id: number, reason: string) {
    const loan = await this.loanRequestRepository.findOne({
      where: { id },
      relations: ["employee"],
    });
    if (!loan) throw new NotFoundException("Loan request not found");

    if (loan.loan_status !== LoanStatus.PENDING)
      throw new BadRequestException(
        "This loan request has already been processed."
      );

    loan.loan_status = LoanStatus.REJECTED;
    await this.loanRequestRepository.save(loan);

    await this.notificationService.create({
      emp_id: loan.employee.id,
      message: `Your loan request has been rejected. Reason: ${reason}`,
      notification_type_id: 2,
    });

    return { success: true, status: "rejected" };
  }

  async statusUpdate(id: number) {
    try {
      const lr = await this.loanRequestRepository.findOneBy({ id });
      if (!lr) throw new NotFoundException("Loan request not found");

      lr.status = lr.status === 0 ? 1 : 0;
      await this.loanRequestRepository.save(lr);

      return toggleStatusResponse("Loan Request", lr.status);
    } catch (err) {
      return errorResponse("Something went wrong", err.message);
    }
  }
}
