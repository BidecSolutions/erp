import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UploadedFiles,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In, Raw } from "typeorm";
import { Employee } from "./employee.entity";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { Department } from "../hrm_department/department.entity";
import { Designation } from "../hrm_designation/designation.entity";
import { BankDetailService } from "../hrm_bank-details/bank-details.service";
import { BankDetail } from "../hrm_bank-details/bank-detail.entity";
// import { Shift } from "../hrm_shift/shift.entity";
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
import { ProbationSetting } from "../hrm_probation-setting/probation-setting.entity";
import { EmpRoaster } from "../hrm_shift/emp-roaster.entity";
import { Shift } from "../hrm_shift/shift.entity";
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
    // @InjectRepository(Shift) private shiftRepository: Repository<Shift>,
    private readonly documentService: DocumentService,
    @InjectRepository(AnnualLeave)
    private annualLeaveRepo: Repository<AnnualLeave>,
    @InjectRepository(ProbationSetting)
    private probationSettingRepo: Repository<ProbationSetting>,
    @InjectRepository(BankDetail)
    private readonly bankDetailRepo: Repository<BankDetail>,
    @InjectRepository(Allowance)
    private readonly allowanceRepo: Repository<Allowance>,
    @InjectRepository(Branch) private readonly branchRepo: Repository<Branch>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,

    @InjectRepository(userRoleMapping)
    private usersRoleRepository: Repository<userRoleMapping>,

    @InjectRepository(userCompanyMapping)
    private readonly companyMaping: Repository<userCompanyMapping>,

    @InjectRepository(EmpRoaster)
    private readonly empRoasterRepo: Repository<EmpRoaster>, // ✅ Add this

    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>
  ) {}

  private async generateEmployeeCode() {
    const lastEmployee = await this.employeeRepository.find({
      order: { id: "DESC" },
      take: 1,
    });
    const newId = lastEmployee.length > 0 ? lastEmployee[0].id + 1 : 1;
    return `EMP-${String(newId).padStart(3, "0")}`;
  }

  async findAll(body) {
    const employees = await this.employeeRepository.find({
      where: {
        status: body.status,
        branch_id: Raw(
          (alias) =>
            `JSON_CONTAINS(${alias}, '${JSON.stringify([body.branch_id])}')`
        ),
      },
      relations: [
        "department",
        "designation",
        "documents",
        "bankDetails",
        "annualLeave",
        "allowances",
        "roasters",
        "branches",
        "probationSetting",
        "user",
      ],
    });

    return employees.map((emp) => {
      const documents = emp.documents || [];
      const baseData: any = {
        id: emp.id,
        name: emp.name,
        email: emp.user?.email || null,
        phone: emp.phone,
        gender: emp.gender,
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
        roaster:
          emp.roasters?.map((r) => ({
            shift_id: r.shift?.id,
            shift_name: r.shift?.name,
            days: r.days,
            start_time: r.start_time,
            end_time: r.end_time,
          })) || [],

        emp_type: emp.emp_type, //  next field will depend on this
      };

      //  insert annualLeave or probationSetting right after emp_type
      if (emp.emp_type === "Probation" && emp.probationSetting) {
        baseData.probationSetting = {
          id: emp.probationSetting.id,
          leave_days: emp.probationSetting.leave_days,
          probation_period: emp.probationSetting.probation_period,
          duration_type: emp.probationSetting.duration_type,
          status: emp.probationSetting.status,
        };
      } else if (emp.emp_type === "Permanent" && emp.annualLeave) {
        baseData.annualLeave = {
          id: emp.annualLeave.id,
          name: emp.annualLeave.name,
          total_leave: emp.annualLeave.total_leave,
          status: emp.annualLeave.status,
        };
      }

      baseData.document =
        documents.length > 0
          ? {
              cv: documents.find((d) => d.type === "cv")?.filePath || null,
              photo:
                documents.find((d) => d.type === "photo")?.filePath || null,
              identity_card:
                documents
                  .filter((d) => d.type === "identity_card")
                  .map((d) => d.filePath) || [],
              academic_transcript:
                documents.find((d) => d.type === "academic_transcript")
                  ?.filePath || null,
            }
          : {
              cv: null,
              photo: null,
              identity_card: [],
              academic_transcript: null,
            };

      baseData.bankDetails = emp.bankDetails || [];

      baseData.allowances =
        emp.allowances?.map((a) => ({
          id: a.id,
          title: a.title,
          type: a.type,
          amount: a.amount,
          company_id: a.company_id,
          status: a.status,
        })) || [];

      baseData.branches =
        emp.branches?.map((b) => ({
          id: b.id,
          name: b.branch_name,
        })) || [];

      baseData.status = emp.status;
  baseData.created_at = emp.created_at;
  baseData.updated_at = emp.updated_at;
      return baseData;
    });
  }

async findOne(id: number) {
  const emp = await this.employeeRepository.findOne({
    where: { id },
    relations: [
      "department",
      "designation",
      "documents",
      "bankDetails",
      "annualLeave",
      "allowances",
      "roasters",
      "branches",
      "probationSetting",
      "user", // include user for email/password
    ],
  });

  if (!emp) throw new NotFoundException(`Employee ID ${id} not found`);

  const documents = emp.documents || [];

  const baseData: any = {
    id: emp.id,
    name: emp.name,
    email: emp.user?.email || null,
    phone: emp.phone,
    gender: emp.gender,
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
    roaster:
      emp.roasters?.map((r) => ({
        shift_id: r.shift?.id,
        shift_name: r.shift?.name,
        days: r.days,
        start_time: r.start_time,
        end_time: r.end_time,
      })) || [],
    emp_type: emp.emp_type,
  };

  if (emp.emp_type === "Probation" && emp.probationSetting) {
    baseData.probationSetting = {
      id: emp.probationSetting.id,
      leave_days: emp.probationSetting.leave_days,
      probation_period: emp.probationSetting.probation_period,
      duration_type: emp.probationSetting.duration_type,
      status: emp.probationSetting.status,
    };
  } else if (emp.emp_type === "Permanent" && emp.annualLeave) {
    baseData.annualLeave = {
      id: emp.annualLeave.id,
      name: emp.annualLeave.name,
      total_leave: emp.annualLeave.total_leave,
      status: emp.annualLeave.status,
    };
  }

  baseData.document =
    documents.length > 0
      ? {
          cv: documents.find((d) => d.type === "cv")?.filePath || null,
          photo: documents.find((d) => d.type === "photo")?.filePath || null,
          identity_card:
            documents
              .filter((d) => d.type === "identity_card")
              .map((d) => d.filePath) || [],
          academic_transcript:
            documents.find((d) => d.type === "academic_transcript")?.filePath ||
            null,
        }
      : {
          cv: null,
          photo: null,
          identity_card: [],
          academic_transcript: null,
        };

  baseData.bankDetails = emp.bankDetails || [];

  baseData.allowances =
    emp.allowances?.map((a) => ({
      id: a.id,
      title: a.title,
      type: a.type,
      amount: a.amount,
      company_id: a.company_id,
      status: a.status,
    })) || [];

  baseData.branches =
    emp.branches?.map((b) => ({
      id: b.id,
      name: b.branch_name,
    })) || [];

  baseData.status = emp.status;
  baseData.created_at = emp.created_at;
  baseData.updated_at = emp.updated_at;

  return baseData;
}


  async create(
    dto: CreateEmployeeDto,
    @UploadedFiles()
    files: {
      cv?: Express.Multer.File[];
      photo?: Express.Multer.File[];
      academic_transcript?: Express.Multer.File[];
      identity_card?: Express.Multer.File[];
    },
    login_company_id: number
  ) {
    try {
      const department = await this.departmentRepository.findOneBy({
        id: dto.departmentId,
      });
      const designation = await this.designationRepository.findOneBy({
        id: dto.designationId,
      });
      // const shift = await this.shiftRepository.findOneBy({ id: dto.shiftId });
      let annualLeave: AnnualLeave | null = null;
      if (dto.annual_leave_id) {
        annualLeave = await this.annualLeaveRepo.findOneBy({
          id: dto.annual_leave_id,
        });
        if (!annualLeave) throw new NotFoundException("Annual Leave not found");
      }

      let probationSetting: ProbationSetting | null = null;
      if (dto.probation_setting_id) {
        probationSetting = await this.probationSettingRepo.findOneBy({
          id: dto.probation_setting_id,
        });
        if (!probationSetting) {
          throw new NotFoundException("Probation Setting not found");
        }
      }

      if (!department) throw new NotFoundException("Department not found");
      if (!designation) throw new NotFoundException("Designation not found");
      // if (!shift) throw new NotFoundException("Shift not found");
      if (!files?.cv) {
        throw new BadRequestException("CV is required");
      }
      if (!files?.photo) {
        throw new BadRequestException("Photo is required");
      }
      if (!files?.identity_card || files.identity_card.length < 2) {
        throw new BadRequestException(
          "Identity Card front and back are required"
        );
      }

      if (dto.emp_type === "Probation") {
        if (dto.annual_leave_id) {
          throw new BadRequestException(
            "Probation employees cannot have Annual Leave"
          );
        }
        if (!dto.probation_setting_id) {
          throw new BadRequestException(
            "Probation employees must have a probation_setting_id"
          );
        }
      } else {
        if (dto.probation_setting_id) {
          throw new BadRequestException(
            "Only probation employees can have probation_setting_id"
          );
        }
      }

      const emp = this.employeeRepository.create({
        ...dto,
        branch_id: Array.isArray(dto.branch_id)
          ? dto.branch_id.map((b) => Number(b))
          : [Number(dto.branch_id)],
        department,
        designation,
        // shift,
        ...(annualLeave ? { annualLeave } : {}),
        ...(probationSetting ? { probationSetting } : {}),
      });

      emp.is_system_user = dto.is_system_user ?? false;

      emp.employeeCode = await this.generateEmployeeCode();

      if (dto.is_system_user) {
        // console.log("system user");
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

      // After saving employee
if (dto.roasters?.length) {
  for (const r of dto.roasters) {
    const shift = await this.shiftRepository.findOneBy({ id: r.shift_id });
    if (!shift) throw new NotFoundException(`Shift not found: ${r.shift_id}`);

    // convert days array to comma-separated string
    const daysString = r.days.join(',');

    const existingRoaster = await this.empRoasterRepo.findOne({
      where: {
        employee: { id: saved.id },
        shift: { id: r.shift_id },
        days: daysString,
      },
    });

    if (existingRoaster) {
      // Update existing
      existingRoaster.start_time = r.start_time;
      existingRoaster.end_time = r.end_time;
      existingRoaster.status = 1;
      await this.empRoasterRepo.save(existingRoaster);
    } else {
      // Create new
      const newRoaster = this.empRoasterRepo.create({
        employee: { id: saved.id },
        shift: { id: shift.id },
        days: r.days,
        start_time: r.start_time,
        end_time: r.end_time,
        status: 1,
      });
      await this.empRoasterRepo.save(newRoaster);
    }
  }
}

      // create System User
      if (saved.is_system_user) {
        // console.log("system user");
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
          branch_id: Array.isArray(dto.branch_id)
            ? dto.branch_id.map((b) => Number(b))
            : [Number(dto.branch_id)],
          company_id: login_company_id,
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
      if (dto.branch_id?.length) {
        const branches = await this.branchRepo.find({
          where: { id: In(dto.branch_id) },
        });
        if (branches.length !== dto.branch_id.length) {
          throw new NotFoundException("Some branches not found");
        }
        saved.branches = branches;
        await this.employeeRepository.save(saved);
      }
      // Save documents
      if (files && Object.keys(files).length > 0) {
        // ab createOrUpdateMany use karo
        await this.documentService.createOrUpdateMany(saved.id, files);
      }

      // Save bank details
      if (dto.bankDetails?.length) {
        await this.bankDetailService.createMany(saved.id, dto.bankDetails);
      }

      return {
        success: true,
        message: "Employee created successfully",
        data: {
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
          roaster:
            saved.roasters?.map((r) => ({
              shift_id: r.shift_id,
              days: r.days,
              start_time: r.start_time,
              end_time: r.end_time,
            })) || [],

          // annualLeave: saved.annualLeave
          //   ? {
          //       id: saved.annualLeave.id,
          //       name: saved.annualLeave.name,
          //       total_leave: saved.annualLeave.total_leave,
          //       status: saved.annualLeave.status,
          //     }
          //   : null,
          ...(saved.emp_type === "Probation"
            ? {
                probationSetting: saved.probationSetting
                  ? {
                      id: saved.probationSetting.id,
                      leave_days: saved.probationSetting.leave_days,
                      probation_period: saved.probationSetting.probation_period,
                      duration_type: saved.probationSetting.duration_type,
                      status: saved.probationSetting.status,
                    }
                  : null,
              }
            : {
                annualLeave: saved.annualLeave
                  ? {
                      id: saved.annualLeave.id,
                      name: saved.annualLeave.name,
                      total_leave: saved.annualLeave.total_leave,
                      status: saved.annualLeave.status,
                    }
                  : null,
              }),
          allowances: saved.allowances?.map((a) => ({
            id: a.id,
            title: a.title,
            type: a.type,
            amount: a.amount,
            company_id: a.company_id,
          })),
          branches:
            saved.branches?.map((b) => ({
              id: b.id,
              name: b.branch_name,
            })) || [],
          emp_type: saved.emp_type,
          status: saved.status,
          created_at: saved.created_at,
          updated_at: saved.updated_at,
        },
      };
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e.message || "Something went wrong");
    }
  }


// async create(
//   dto: CreateEmployeeDto,
//   @UploadedFiles()
//   files: {
//     cv?: Express.Multer.File[];
//     photo?: Express.Multer.File[];
//     academic_transcript?: Express.Multer.File[];
//     identity_card?: Express.Multer.File[];
//   },
//   login_company_id: number
// ) {
//   try {
//     // --- Department & Designation ---
//     const department = await this.departmentRepository.findOneBy({ id: dto.departmentId });
//     const designation = await this.designationRepository.findOneBy({ id: dto.designationId });
//     if (!department) throw new NotFoundException("Department not found");
//     if (!designation) throw new NotFoundException("Designation not found");

//     // --- Annual Leave & Probation ---
//     let annualLeave: AnnualLeave | null = null;
//     if (dto.annual_leave_id) {
//       annualLeave = await this.annualLeaveRepo.findOneBy({ id: dto.annual_leave_id });
//       if (!annualLeave) throw new NotFoundException("Annual Leave not found");
//     }
//     let probationSetting: ProbationSetting | null = null;
//     if (dto.probation_setting_id) {
//       probationSetting = await this.probationSettingRepo.findOneBy({ id: dto.probation_setting_id });
//       if (!probationSetting) throw new NotFoundException("Probation Setting not found");
//     }

//     // --- Mandatory files check ---
//     if (!files?.cv) throw new BadRequestException("CV is required");
//     if (!files?.photo) throw new BadRequestException("Photo is required");
//     if (!files?.identity_card || files.identity_card.length < 2)
//       throw new BadRequestException("Identity Card front and back are required");

//     // --- Employee Type Validation ---
//     if (dto.emp_type === "Probation") {
//       if (dto.annual_leave_id)
//         throw new BadRequestException("Probation employees cannot have Annual Leave");
//       if (!dto.probation_setting_id)
//         throw new BadRequestException("Probation employees must have a probation_setting_id");
//     } else {
//       if (dto.probation_setting_id)
//         throw new BadRequestException("Only probation employees can have probation_setting_id");
//     }

//     // --- Create Employee ---
//     const emp = this.employeeRepository.create({
//       ...dto,
//       branch_id: Array.isArray(dto.branch_id) ? dto.branch_id.map((b) => Number(b)) : [Number(dto.branch_id)],
//       department,
//       designation,
//       ...(annualLeave ? { annualLeave } : {}),
//       ...(probationSetting ? { probationSetting } : {}),
//     });

//     emp.is_system_user = dto.is_system_user ?? false;
//     emp.employeeCode = await this.generateEmployeeCode();

//     // --- Save Employee ---
//     const saved = await this.employeeRepository.save(emp);

//     // --- Handle Roasters (Duplicate Safe) ---
//    // EmpRoaster save/update
// if (dto.roasters?.length) {
//   for (const r of dto.roasters) {
//     const shift = await this.shiftRepository.findOneBy({ id: r.shift_id });
//     if (!shift) throw new NotFoundException(`Shift not found: ${r.shift_id}`);

//     // convert days array to comma-separated string
//     const daysString = r.days.join(',');

//     const existingRoaster = await this.empRoasterRepo.findOne({
//       where: {
//         employee: { id: saved.id },
//         shift: { id: r.shift_id },
//         days: daysString,
//       },
//     });

//     if (existingRoaster) {
//       // Update existing
//       existingRoaster.start_time = r.start_time;
//       existingRoaster.end_time = r.end_time;
//       existingRoaster.status = 1;
//       await this.empRoasterRepo.save(existingRoaster);
//     } else {
//       // Create new
//       const newRoaster = this.empRoasterRepo.create({
//         employee: { id: saved.id },
//         shift: { id: shift.id },
//         days: r.days,
//         start_time: r.start_time,
//         end_time: r.end_time,
//         status: 1,
//       });
//       await this.empRoasterRepo.save(newRoaster);
//     }
//   }
// }


//     // --- System User Creation ---
//     if (saved.is_system_user) {
//       if (!dto.email || !dto.password) throw new BadRequestException("Email and password are required");
//       if (!dto.role_id) throw new BadRequestException("Please select a user role in the system");

//       const findEmail = await this.userRepository.findOne({ where: { email: dto.email } });
//       if (findEmail) throw new BadRequestException("Email already exists, please enter a unique one");

//       const hashedPassword = await bcrypt.hash(dto.password ?? "123456789", 10);
//       const user = this.userRepository.create({
//         name: saved.name,
//         email: dto.email,
//         password: hashedPassword,
//         employee: saved,
//       });
//       const userid = await this.userRepository.save(user);

//       // User Role
//       const userRole = this.usersRoleRepository.create({ user_id: userid.id, roll_id: dto.role_id });
//       await this.usersRoleRepository.save(userRole);

//       // User Company & Branch Mapping
//       const companyMapping = this.companyMaping.create({
//         user_id: userid.id,
//         branch_id: Array.isArray(dto.branch_id) ? dto.branch_id.map((b) => Number(b)) : [Number(dto.branch_id)],
//         company_id: login_company_id,
//       });
//       await this.companyMaping.save(companyMapping);
//     }

//     // --- Save Allowances ---
//     if (dto.allowance_ids?.length) {
//       const allowances = await this.allowanceRepo.find({ where: { id: In(dto.allowance_ids) } });
//       if (allowances.length !== dto.allowance_ids.length) throw new NotFoundException("Some allowances not found");
//       saved.allowances = allowances;
//       await this.employeeRepository.save(saved);
//     }

//     // --- Save Branches ---
//     if (dto.branch_id?.length) {
//       const branches = await this.branchRepo.find({ where: { id: In(dto.branch_id) } });
//       if (branches.length !== dto.branch_id.length) throw new NotFoundException("Some branches not found");
//       saved.branches = branches;
//       await this.employeeRepository.save(saved);
//     }

//     // --- Save Documents ---
//     if (files && Object.keys(files).length > 0) {
//       await this.documentService.createOrUpdateMany(saved.id, files);
//     }

//     // --- Save Bank Details ---
//     if (dto.bankDetails?.length) {
//       await this.bankDetailService.createMany(saved.id, dto.bankDetails);
//     }

//     return {
//       success: true,
//       message: "Employee created successfully",
//       data: saved,
//     };
//   } catch (e) {
//     console.error(e);
//     throw new BadRequestException(e.message || "Something went wrong");
//   }
// }


  async update(
    id: number,
    dto: UpdateEmployeeDto,
    files?: {
      cv?: Express.Multer.File[];
      photo?: Express.Multer.File[];
      identity_card?: Express.Multer.File[];
      academic_transcript?: Express.Multer.File[];
    }
  ) {
    const emp = await this.employeeRepository.findOne({
      where: { id },
      relations: [
         "department",
        "designation",
        "annualLeave",
        "probationSetting",
        "roasters",
        "allowances",
        "branches",
        "user",
      ],
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

    // let annualLeave: AnnualLeave | null = null;
    // if (dto.annual_leave_id) {
    //   annualLeave = await this.annualLeaveRepo.findOneBy({
    //     id: dto.annual_leave_id,
    //   });
    //   if (!annualLeave) throw new NotFoundException("Annual Leave not found");
    // }

    // let probationSetting: ProbationSetting | null = null;
    // if (dto.probation_setting_id) {
    //   probationSetting = await this.probationSettingRepo.findOneBy({
    //     id: dto.probation_setting_id,
    //   });
    //   if (!probationSetting) {
    //     throw new NotFoundException("Probation Setting not found");
    //   }
    // }

    // // Employee type logic
    // if (dto.emp_type === "Probation") {
    //   if (dto.annual_leave_id) {
    //     throw new BadRequestException(
    //       "Probation employees cannot have Annual Leave"
    //     );
    //   }
    //   if (!dto.probation_setting_id && !emp.probationSetting) {
    //     throw new BadRequestException(
    //       "Probation employees must have a probation_setting_id"
    //     );
    //   }
    //   // Remove annual leave if exists
    //   emp.annualLeave = null;
    // } else {
    //   // Permanent employee
    //   if (dto.probation_setting_id) {
    //     throw new BadRequestException(
    //       "Only probation employees can have probation_setting_id"
    //     );
    //   }
    //   emp.probationSetting = null;
    // }
let annualLeave: AnnualLeave | null = null;
let probationSetting: ProbationSetting | null = null;

// Fetch Annual Leave
if (dto.annual_leave_id) {
  annualLeave = await this.annualLeaveRepo.findOneBy({
    id: dto.annual_leave_id,
  });
  if (!annualLeave) throw new NotFoundException("Annual Leave not found");
}

// Fetch Probation Setting
if (dto.probation_setting_id) {
  probationSetting = await this.probationSettingRepo.findOneBy({
    id: dto.probation_setting_id,
  });
  if (!probationSetting) throw new NotFoundException(
    "Probation Setting not found"
  );
}

// Employee type validation
if (dto.emp_type === "Probation") {
  // Probation employees
  if (!dto.probation_setting_id && !emp.probationSetting) {
    throw new BadRequestException(
      "Probation employees must have a probation_setting_id"
    );
  }
  if (dto.annual_leave_id) {
    throw new BadRequestException(
      "Probation employees cannot have Annual Leave"
    );
  }
  emp.probationSetting = probationSetting ?? emp.probationSetting;
  emp.annualLeave = null;
} else if (dto.emp_type === "Permanent") {
  // Permanent employees
  if (!dto.annual_leave_id && !emp.annualLeave) {
    throw new BadRequestException(
      "Permanent employees must have an annual_leave_id"
    );
  }
  if (dto.probation_setting_id) {
    throw new BadRequestException(
      "Permanent employees cannot have probation_setting_id"
    );
  }
  emp.annualLeave = annualLeave ?? emp.annualLeave;
  emp.probationSetting = null;
}

   if (dto.bankDetails?.length) {
    for (const bd of dto.bankDetails) {
      if (!bd.id) continue; // skip creation
      const existing = await this.bankDetailRepo.findOne({ where: { id: bd.id } });
      if (!existing) continue;

      if (bd.accountHolderName !== undefined) existing.accountHolderName = bd.accountHolderName;
      if (bd.accountNumber !== undefined) existing.accountNumber = bd.accountNumber;
      if (bd.bankName !== undefined) existing.bankName = bd.bankName;

      existing.employee = { id: emp.id } as Employee; // Ensure FK is set
      await this.bankDetailRepo.save(existing);
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

    //  Update branches in employee
    if (dto.branch_id && dto.branch_id.length > 0) {
      const branches = await this.branchRepo.find({
        where: { id: In(dto.branch_id) },
      });
      emp.branches = branches;
      await this.employeeRepository.save(emp);
    }

    //  Now update mapping table manually
    const mapping = await this.companyMaping.findOne({
      where: { user_id: emp.user?.id },
    });

    if (mapping) {
      mapping.branch_id = (dto.branch_id ?? []).map((b) => Number(b));
      await this.companyMaping.save(mapping);
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

    if (dto.roasters?.length) {
  await this.empRoasterRepo.delete({ employee: { id } });

  const empRoasters: EmpRoaster[] = [];
  for (const r of dto.roasters) {
    empRoasters.push(
      this.empRoasterRepo.create({
        employee: { id },
        shift: { id: r.shift_id },
        days: r.days,
        start_time: r.start_time,
        end_time: r.end_time,
        status: 1,
      })
    );
  }

  await this.empRoasterRepo.save(empRoasters);
}


    // Documents
    // Save/update documents via DocumentService
    if (files && Object.keys(files).length > 0) {
      await this.documentService.createOrUpdateMany(emp.id, files);
    }

    // Identity Card array update

    const fullEmp = await this.employeeRepository.findOne({
      where: { id: saved.id },
      relations: [
        "department",
        "designation",
  
        "annualLeave",
        "allowances",
        "branches",
        "branches",
      ],
    });

    if (!fullEmp) throw new NotFoundException("Employee not found after save");

    return {
      success: true,
      message: "Employee updated successfully",
      data: {
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
        shift:
          emp.roasters?.map((r) => ({
            shift_name: r.shift?.name,
            days: r.days,
            start_time: r.start_time,
            end_time: r.end_time,
          })) || [],

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
        branches:
          fullEmp.branches?.map((b) => ({
            id: b.id,
            name: b.branch_name,
          })) || [],
        status: fullEmp.status,
        created_at: fullEmp.created_at,
        updated_at: fullEmp.updated_at,
      },
    };
  }

  async statusUpdate(id: number) {
    try {
      const emp = await this.employeeRepository.findOne({
        where: { id },
        relations: ["documents", "bankDetails", "user"],
      });

      if (!emp) throw new NotFoundException("Employee Not Found");

      //  toggle employee status
      emp.status = emp.status === 0 ? 1 : 0;

      //  update employee
      await this.employeeRepository.save(emp);

      //  cascade to documents
      if (emp.documents?.length) {
        await this.documentService.updateStatusForMany(
          emp.documents,
          emp.status
        );
      }

      //  cascade to bankDetails of this employee only
      await this.bankDetailRepo
        .createQueryBuilder()
        .update(BankDetail)
        .set({ status: emp.status })
        .where("employeeId = :id", { id: emp.id })
        .execute();

      //  cascade to user
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
