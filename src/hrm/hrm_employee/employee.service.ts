import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { Employee } from "./employee.entity";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { Department } from "../hrm_department/department.entity";
import { Designation } from "../hrm_designation/designation.entity";
import { BankDetailService } from "../hrm_bank-details/bank-details.service";
import { BankDetail } from "../hrm_bank-details/bank-detail.entity";
import { Shift } from "../hrm_shift/shift.entity";
import { DocumentService } from "../hrm_document/document.service";
import { Allowance } from "../hrm_allowance/allowance.entity";
import { AnnualLeave } from "../hrm_annual-leave/annual-leave.entity";
import { User } from "src/entities/user.entity";
import * as bcrypt from "bcryptjs";
import { userRoleMapping } from "src/entities/user-role-mapping.entity";
import { userCompanyMapping } from "src/entities/user-company-mapping.entity";
import {
  errorResponse,
  toggleStatusResponse,
} from "src/commonHelper/response.util";
import { Branch } from "src/Company/branch/branch.entity";
@Injectable()
export class EmployeeService {
  // statusUpdate(id: number) {
  //   throw new Error('Method not implemented.');
  // }
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
    @InjectRepository(AnnualLeave)
    private annualLeaveRepo: Repository<AnnualLeave>,
    @InjectRepository(BankDetail)
    private readonly bankDetailRepo: Repository<BankDetail>,
    @InjectRepository(Allowance)
    private readonly allowanceRepo: Repository<Allowance>,
    @InjectRepository(Branch) private readonly branchRepo: Repository<Branch>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,

    @InjectRepository(userRoleMapping)
    private usersRoleRepository: Repository<userRoleMapping>,

    @InjectRepository(userCompanyMapping)
    private readonly companyMaping: Repository<userCompanyMapping>
  ) {}

  private async generateEmployeeCode(): Promise<string> {
    const lastEmployee = await this.employeeRepository.find({
      order: { id: "DESC" },
      take: 1,
    });
    const newId = lastEmployee.length > 0 ? lastEmployee[0].id + 1 : 1;
    return `EMP-${String(newId).padStart(3, "0")}`;
  }

  async findAll(filterStatus?: number) {
    const status = filterStatus !== undefined ? filterStatus : 1;
    const employees = await this.employeeRepository.find({
      where: { status },
      relations: [
        "department",
        "designation",
        "documents",
        "bankDetails",
        "annualLeave",
        "allowances",
        "shift",
         "branches",
      ],
    });

    return employees.map((emp) => ({
      id: emp.id,
      name: emp.name,
      phone: emp.phone,
      gender: emp.gender,
      // email: emp.email,
      // password: emp.password,
      is_system_user: emp.is_system_user,
      address: emp.address,
      dateOfBirth: emp.dateOfBirth,
      locationType: emp.locationType,
      department: emp.department?.name || null,
      designation: emp.designation?.name || null,
      dateOfJoining: emp.dateOfJoining,
      employeeCode: emp.employeeCode,
      hoursPerDay: emp.hoursPerDay,
      daysPerWeek: emp.daysPerWeek,
      fixedSalary: emp.fixedSalary,
      shift: emp.shift?.name || null,
      documents: emp.documents || [],
      bankDetails: emp.bankDetails || [],
      annualLeave: emp.annualLeave || [],
      allowances:
        emp.allowances?.map((a) => ({
          id: a.id,
          title: a.title,
          type: a.type,
          amount: a.amount,
          company_id: a.company_id,
          status: a.status,
        })) || [],
      branches: emp.branches?.map(b => ({
      id: b.id,
      name: b.branch_name,
    })) || [],
      status: emp.status,
    }));
  }

  async findOne(id: number) {
    const emp = await this.employeeRepository.findOne({
      where: { id },
      relations: [
        "department",
        "designation",
        "shift",
        "annualLeave",
        "allowances",
        "documents",
        "bankDetails",
         "branches",
      ],
    });

    if (!emp) throw new NotFoundException(`Employee ID ${id} not found`);

    return {
      id: emp.id,
      name: emp.name,
      phone: emp.phone,
      gender: emp.gender,
      // email: emp.email,
      // password: emp.password,
      is_system_user: emp.is_system_user,
      address: emp.address,
      dateOfBirth: emp.dateOfBirth,
      locationType: emp.locationType,
      department: emp.department?.name || null,
      designation: emp.designation?.name || null,
      shift: emp.shift?.name || null,
      dateOfJoining: emp.dateOfJoining,
      employeeCode: emp.employeeCode,
      hoursPerDay: emp.hoursPerDay,
      daysPerWeek: emp.daysPerWeek,
      fixedSalary: emp.fixedSalary,
      documents: emp.documents || [],
      bankDetails: emp.bankDetails || [],
      annualLeave: emp.annualLeave || [],
      allowances:
        emp.allowances?.map((a) => ({
          id: a.id,
          title: a.title,
          type: a.type,
          amount: a.amount,
          company_id: a.company_id,
        })) || [],
      branches: emp.branches?.map(b => ({
      id: b.id,
      name: b.branch_name,
    })) || [],
      status: emp.status,
      created_at: emp.created_at,
      updated_at: emp.updated_at,
    };
  }

  async create(
    dto: CreateEmployeeDto,
    files?: { cv?: Express.Multer.File[]; photo?: Express.Multer.File[] }
  ) {
    try {
      const department = await this.departmentRepository.findOneBy({
        id: dto.departmentId,
      });
      const designation = await this.designationRepository.findOneBy({
        id: dto.designationId,
      });
      const shift = await this.shiftRepository.findOneBy({ id: dto.shiftId });
      let annualLeave: AnnualLeave | null = null;
      if (dto.annual_leave_id) {
        annualLeave = await this.annualLeaveRepo.findOneBy({
          id: dto.annual_leave_id,
        });
        if (!annualLeave) throw new NotFoundException("Annual Leave not found");
      }
      if (!department) throw new NotFoundException("Department not found");
      if (!designation) throw new NotFoundException("Designation not found");
      if (!shift) throw new NotFoundException("Shift not found");

      const emp = this.employeeRepository.create({
        ...dto,
        department,
        designation,
        shift,
        ...(annualLeave ? { annualLeave } : {}),
      });

      emp.is_system_user = dto.is_system_user ?? false;

      emp.employeeCode = await this.generateEmployeeCode();

      if (dto.is_system_user) {
        console.log("system user");
        if (!dto.email || !dto.password) {
          throw new BadRequestException("Email and password are required");
        }
        if (!dto.role_id) {
          throw new BadRequestException(
            "Please select a user role in the system"
          );
        }

        const findEmail = await this.userRepository.findOne({
          where: { email: dto.email },
        });
        if (findEmail) {
          throw new BadRequestException(
            "Email already exists, please enter a unique one"
          );
        }
      }

      const saved = await this.employeeRepository.save(emp);

      // create System User
      if (saved.is_system_user) {
        console.log("system user");
        const hashedPassword = await bcrypt.hash(
          dto.password ?? "123456789",
          10
        );
        const user = this.userRepository.create({
          name: saved.name,
          email: dto.email,
          password: hashedPassword,
          employee: saved,
        });
        const userid = await this.userRepository.save(user);

        //create User Role
        const userRole = this.usersRoleRepository.create({
          user_id: userid.id,
          roll_id: dto.role_id,
        });
        await this.usersRoleRepository.save(userRole);

        //user company and branch Mapping
        const companyMapping = this.companyMaping.create({
          user_id: userid.id,
          // branch_id: dto.branch_id ? (Array.isArray(dto.branch_id) ? dto.branch_id : [dto.branch_id]) : [],
        });
        await this.companyMaping.save(companyMapping);
      }

      // Save allowances
      if (dto.allowance_ids?.length) {
        const allowances = await this.allowanceRepo.find({
          where: { id: In(dto.allowance_ids) },
        });
        if (allowances.length !== dto.allowance_ids.length) {
          throw new NotFoundException("Some allowances not found");
        }
        saved.allowances = allowances;
        await this.employeeRepository.save(saved);
      }

      // Save branches
      if (dto.branch_ids?.length) {
        const branches = await this.branchRepo.find({
          where: { id: In(dto.branch_ids) },
        });
        if (branches.length !== dto.branch_ids.length) {
          throw new NotFoundException("Some branches not found");
        }
        saved.branches = branches;
        await this.employeeRepository.save(saved);
      }
      // Save documents
      if (files && Object.keys(files).length > 0) {
        await this.documentService.createMany(saved.id, files);
      }

      // Save bank details
      if (dto.bankDetails?.length) {
        await this.bankDetailService.createMany(saved.id, dto.bankDetails);
      }

      return {
        id: saved.id,
        name: saved.name,
        phone: saved.phone,
        gender: saved.gender,
        // email: saved.email,
        is_system_user: saved.is_system_user,
        address: saved.address,
        dateOfBirth: saved.dateOfBirth,
        department: saved.department?.name,
        designation: saved.designation?.name,
        dateOfJoining: saved.dateOfJoining,
        employeeCode: saved.employeeCode,
        hoursPerDay: saved.hoursPerDay,
        daysPerWeek: saved.daysPerWeek,
        fixedSalary: saved.fixedSalary,
        shift: saved.shift?.name,
        annualLeave: saved.annualLeave
          ? {
              id: saved.annualLeave.id,
              name: saved.annualLeave.name,
              total_leave: saved.annualLeave.total_leave,
              status: saved.annualLeave.status,
            }
          : null,
        allowances: saved.allowances?.map((a) => ({
          id: a.id,
          title: a.title,
          type: a.type,
          amount: a.amount,
          company_id: a.company_id,
        })),
        branches: saved.branches?.map(b => ({
        id: b.id,
        name: b.branch_name,
      })) || [],
        status: saved.status,
        created_at: saved.created_at,
        updated_at: saved.updated_at,
      };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async update(
    id: number,
    dto: UpdateEmployeeDto,
    files?: { cv?: Express.Multer.File[]; photo?: Express.Multer.File[] }
  ) {
    const emp = await this.employeeRepository.findOne({
      where: { id },
      relations: ["department", "designation", "shift", "bankDetails"],
    });
    if (!emp) throw new NotFoundException(`Employee ID ${id} not found`);

    // Update relations
    if (dto.departmentId) {
      const department = await this.departmentRepository.findOneBy({
        id: dto.departmentId,
      });
      if (!department) throw new NotFoundException("Department not found");
      emp.department = department;
    }

    if (dto.designationId) {
      const designation = await this.designationRepository.findOneBy({
        id: dto.designationId,
      });
      if (!designation) throw new NotFoundException("Designation not found");
      emp.designation = designation;
    }

    if (dto.shiftId) {
      const shift = await this.shiftRepository.findOneBy({ id: dto.shiftId });
      if (!shift) throw new NotFoundException("Shift not found");
      emp.shift = shift;
    }

    if (dto.annual_leave_id) {
      const annualLeave = await this.annualLeaveRepo.findOneBy({
        id: dto.annual_leave_id,
      });
      if (!annualLeave) throw new NotFoundException("Annual Leave not found");
      emp.annualLeave = annualLeave;
    }

    if (dto.bankDetails) {
      for (const bd of dto.bankDetails) {
        if (bd.id) await this.bankDetailRepo.update(bd.id, bd);
        else {
          const newBank = this.bankDetailRepo.create({ ...bd, employee: emp });
          await this.bankDetailRepo.save(newBank);
        }
      }
    }
    if (dto.allowance_ids?.length) {
      const allowances = await this.allowanceRepo.find({
        where: { id: In(dto.allowance_ids) },
      });
      if (allowances.length !== dto.allowance_ids.length)
        throw new NotFoundException("Some allowances not found");
      emp.allowances = allowances;
    }

    if (dto.branch_ids?.length) {
      const branches = await this.branchRepo.find({
        where: { id: In(dto.branch_ids) },
      });
      if (branches.length !== dto.branch_ids.length)
        throw new NotFoundException("Some branches not found");
      emp.branches = branches;
    }

    // Update Employee fields
    Object.assign(emp, dto);

    // Handle is_system_user change
    if (dto.is_system_user !== undefined) {
      emp.is_system_user = dto.is_system_user;

      const user = await this.userRepository.findOne({
        where: { employee: { id: emp.id } },
      });

      if (emp.is_system_user && !user) {
        // Create User if not exists
        if (!dto.email || !dto.password)
          throw new NotFoundException(
            "Email and password required for system user"
          );
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const newUser = this.userRepository.create({
          name: emp.name,
          email: dto.email,
          password: hashedPassword,
          employee: emp,
        });
        await this.userRepository.save(newUser);
      } else if (!emp.is_system_user && user) {
        // Delete User if exists
        await this.userRepository.remove(user);
      }
    }

    const saved = await this.employeeRepository.save(emp);

    // Documents
    if (files && Object.keys(files).length > 0) {
      await this.documentService.createMany(saved.id, files);
    }

    const fullEmp = await this.employeeRepository.findOne({
      where: { id: saved.id },
      relations: [
        "department",
        "designation",
        "shift",
        "annualLeave",
        "allowances",
         "branches",
      ],
    });

    if (!fullEmp) throw new NotFoundException("Employee not found after save");

    return {
      id: fullEmp.id,
      name: fullEmp.name,
      phone: fullEmp.phone,
      gender: fullEmp.gender,
      is_system_user: fullEmp.is_system_user,
      address: fullEmp.address,
      dateOfBirth: fullEmp.dateOfBirth,
      department: fullEmp.department?.name,
      designation: fullEmp.designation?.name,
      dateOfJoining: fullEmp.dateOfJoining,
      employeeCode: fullEmp.employeeCode,
      hoursPerDay: fullEmp.hoursPerDay,
      daysPerWeek: fullEmp.daysPerWeek,
      fixedSalary: fullEmp.fixedSalary,
      shift: fullEmp.shift?.name,
      annualLeave: fullEmp.annualLeave
        ? {
            id: fullEmp.annualLeave.id,
            name: fullEmp.annualLeave.name,
            total_leave: fullEmp.annualLeave.total_leave,
            status: fullEmp.annualLeave.status,
          }
        : null,
      allowances:
        fullEmp.allowances?.map((a) => ({
          id: a.id,
          title: a.title,
          type: a.type,
          amount: a.amount,
          company_id: a.company_id,
        })) || [],
         branches: fullEmp.branches?.map(b => ({
      id: b.id,
      name: b.branch_name,
    })) || [],
      status: fullEmp.status,
      created_at: fullEmp.created_at,
      updated_at: fullEmp.updated_at,
    };
  }

  async remove(id: number) {
    const emp = await this.employeeRepository.findOneBy({ id });
    if (!emp) throw new NotFoundException(`Employee ID ${id} not found`);
    await this.employeeRepository.remove(emp);
    return { message: `Employee ID ${id} deleted successfully` };
  }
  async statusUpdate(id: number) {
    try {
      const emp = await this.employeeRepository.findOne({
        where: { id },
        relations: ["documents", "bankDetails", "user"],
      });

      if (!emp) throw new NotFoundException("Employee Not Found");

      // 🔹 toggle employee status
      emp.status = emp.status === 0 ? 1 : 0;

      // 🔹 update employee
      await this.employeeRepository.save(emp);

      // 🔹 cascade to documents
      if (emp.documents?.length) {
        await this.documentService.updateStatusForMany(
          emp.documents,
          emp.status
        );
      }

      // 🔹 cascade to bankDetails of this employee only
      await this.bankDetailRepo
        .createQueryBuilder()
        .update(BankDetail)
        .set({ status: emp.status })
        .where("employeeId = :id", { id: emp.id })
        .execute();

      // 🔹 cascade to user
      // if (emp.user) {
      //   emp.user.status = emp.status;
      //   await this.userRepository.save(emp.user);
      // }

      return toggleStatusResponse("employee", emp.status);
    } catch (err) {
      return errorResponse("Something went wrong", err.message);
    }
  }
}
