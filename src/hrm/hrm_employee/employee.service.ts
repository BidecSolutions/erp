// import { Injectable, NotFoundException } from "@nestjs/common";
// import { InjectRepository } from "@nestjs/typeorm";
// import { Repository } from "typeorm";
// import { Employee } from "./employee.entity";
// import { CreateEmployeeDto } from "./dto/create-employee.dto";
// import { UpdateEmployeeDto } from "./dto/update-employee.dto";
// import { Department } from "../hrm_department/department.entity";
// import { Designation } from "../hrm_designation/designation.entity";
// import { BankDetailService } from "../hrm_bank-details/bank-details.service";
// import { BankDetail } from "../hrm_bank-details/bank-detail.entity";
// import { Shift } from "../hrm_shift/shift.entity";
// import { DocumentService } from "../hrm_document/document.service";
// import { LeaveSetup } from "../hrm_leave-setup/leave-setup.entity";
// import { Allowance } from "../hrm_allowance/allowance.entity";

// @Injectable()
// export class EmployeeService {
//   constructor(
//     @InjectRepository(Employee)
//     private employeeRepository: Repository<Employee>,
//     @InjectRepository(Department)
//     private departmentRepository: Repository<Department>,
//     @InjectRepository(Designation)
//     private designationRepository: Repository<Designation>,
//     private readonly bankDetailService: BankDetailService,
//     @InjectRepository(Shift) private shiftRepository: Repository<Shift>,
//     private readonly documentService: DocumentService,
//     @InjectRepository(LeaveSetup) private leaveSetupRepo: Repository<LeaveSetup>,
//     @InjectRepository(BankDetail)
// private readonly bankDetailRepo: Repository<BankDetail>,
// @InjectRepository(Allowance)
//     private readonly allowanceRepo: Repository<Allowance>,

//   ) {}

//   private async generateEmployeeCode(): Promise<string> {
//     const lastEmployee = await this.employeeRepository.find({
//       order: { id: "DESC" },
//       take: 1,
//     });
//     const newId = lastEmployee.length > 0 ? lastEmployee[0].id + 1 : 1;
//     return `EMP-${String(newId).padStart(3, "0")}`;
//   }

//   async findAll() {
//     const employees = await this.employeeRepository.find({
//       relations: ["department", "designation", "documents", "bankDetails", "leaveSetup"],
//     });

//     return employees.map((emp) => ({
//       ...emp,
//       department: emp.department?.name || null,
//       designation: emp.designation?.name || null,
//       documents: emp.documents || [],
//       bankDetails: emp.bankDetails || [],
//       leaveSetup: emp.leaveSetup || [],
//     }));
//   }

//   async findOne(id: number) {
//     const emp = await this.employeeRepository.findOne({
//       where: { id },
//       relations: ["department", "designation", "documents", "bankDetails", "leaveSetup"],
//     });
//     if (!emp) throw new NotFoundException(`Employee ID ${id} not found`);

//     return {
//       ...emp,
//       department: emp.department?.name || null,
//       designation: emp.designation?.name || null,
//       documents: emp.documents || [],
//       bankDetails: emp.bankDetails || [],
//       leaveSetup: emp.leaveSetup || [],
//     };
//   }

//   // async create(
//   //   dto: CreateEmployeeDto,
//   //   files?: { cv?: Express.Multer.File[]; photo?: Express.Multer.File[] }
//   // ) {
//   //   const department = await this.departmentRepository.findOneBy({
//   //     id: dto.departmentId,
//   //   });
//   //   const designation = await this.designationRepository.findOneBy({
//   //     id: dto.designationId,
//   //   });
//   //   const shift = await this.shiftRepository.findOneBy({ id: dto.shiftId });
//   //   const leaveSetup = await this.leaveSetupRepo.findOneBy({ id: dto.leave_setup_id });

//   //   if (!department) throw new NotFoundException("Department not found");
//   //   if (!designation) throw new NotFoundException("Designation not found");
//   //   if (!shift) throw new NotFoundException("Shift not found");
//   //   if (!leaveSetup) throw new NotFoundException('Leave Setup not found');

//   //   const emp = this.employeeRepository.create({
//   //     ...dto,
//   //     department,
//   //     designation,
//   //     shift,
//   //     leaveSetup
//   //   });

//   //   emp.is_system_user = dto.is_system_user ?? true;
//   //   if (!dto.is_system_user) {
//   //     emp.email = null;
//   //     emp.password = null;
//   //   }

//   //   emp.employeeCode = await this.generateEmployeeCode();
//   //   const saved = await this.employeeRepository.save(emp);

//   //   // save documents
//   //   if (files && Object.keys(files).length > 0) {
//   //     await this.documentService.createMany(saved.id, files);
//   //   }

//   //   //  Save bank details agar aayein
//   //   if (dto.bankDetails && dto.bankDetails.length > 0) {
//   //     await this.bankDetailService.createMany(saved.id, dto.bankDetails);
//   //   }

//   //   // Dobara fetch kar ke sirf names return karenge
//   //   const fullEmp = await this.employeeRepository.findOne({
//   //     where: { id: saved.id },
//   //     relations: ["department", "designation", "shift"],
//   //   });

//   //   if (!fullEmp) throw new NotFoundException("Employee not found after save");

//   //   return {
//   //     ...saved,
//   //     department: fullEmp.department.name,
//   //     designation: fullEmp.designation.name,
//   //     shift: fullEmp.shift.name,
//   //   };
//   // }
//   async create(dto: CreateEmployeeDto, files?: { cv?: Express.Multer.File[], photo?: Express.Multer.File[] }) {
//   const department = await this.departmentRepository.findOneBy({ id: dto.departmentId });
//   const designation = await this.designationRepository.findOneBy({ id: dto.designationId });
//   const shift = await this.shiftRepository.findOneBy({ id: dto.shiftId });
//   const leaveSetup = await this.leaveSetupRepo.findOneBy({ id: dto.leave_setup_id });

//   if (!department) throw new NotFoundException("Department not found");
//   if (!designation) throw new NotFoundException("Designation not found");
//   if (!shift) throw new NotFoundException("Shift not found");
//   if (!leaveSetup) throw new NotFoundException("Leave Setup not found");

//   // Fetch all allowances if given
//   let allowances: Allowance[] = [];
//   if (dto.allowance_ids && dto.allowance_ids.length > 0) {
//     allowances = await this.allowanceRepo.findByIds(dto.allowance_ids);
//     if (allowances.length !== dto.allowance_ids.length)
//       throw new NotFoundException('Some Allowances not found');
//   }

//   const emp = this.employeeRepository.create({
//     ...dto,
//     department,
//     designation,
//     shift,
//     leaveSetup,
//     allowances,
//   });

//   emp.is_system_user = dto.is_system_user ?? true;
//   if (!dto.is_system_user) {
//     emp.email = null;
//     emp.password = null;
//   }

//   emp.employeeCode = await this.generateEmployeeCode();
//   const saved = await this.employeeRepository.save(emp);

//   // save documents
//   if (files && Object.keys(files).length > 0) {
//     await this.documentService.createMany(saved.id, files);
//   }

//   // Save bank details if any
//   if (dto.bankDetails && dto.bankDetails.length > 0) {
//     await this.bankDetailService.createMany(saved.id, dto.bankDetails);
//   }
// return {
//   ...saved,
//   department: saved.department?.name,
//   designation: saved.designation?.name,
//   shift: saved.shift?.name,
//   allowances: saved.allowances?.map(a => ({
//     id: a.id,
//     title: a.title,
//     type: a.type,
//     amount: a.amount,
//   })) || [], // fallback to empty array if undefined
// };

// }


//   async update(
//     id: number,
//     dto: UpdateEmployeeDto,
//     files?: { cv?: Express.Multer.File[]; photo?: Express.Multer.File[] }
//   ) {
//     const emp = await this.employeeRepository.findOne({
//       where: { id },
//       relations: ["department", "designation", "shift","bankDetails"],
//     });
//     if (!emp) throw new NotFoundException(`Employee ID ${id} not found`);

//     if (dto.departmentId) {
//       const department = await this.departmentRepository.findOneBy({
//         id: dto.departmentId,
//       });
//       if (!department) throw new NotFoundException("Department not found");
//       emp.department = department;
//     }

//     if (dto.designationId) {
//       const designation = await this.designationRepository.findOneBy({
//         id: dto.designationId,
//       });
//       if (!designation) throw new NotFoundException("Designation not found");
//       emp.designation = designation;
//     }

//     if (dto.shiftId) {
//       const shift = await this.shiftRepository.findOneBy({ id: dto.shiftId });
//       if (!shift) throw new NotFoundException("Shift not found");
//       emp.shift = shift;
//     }

//     if (dto.leave_setup_id) {
//       const leaveSetup = await this.leaveSetupRepo.findOneBy({
//         id: dto.leave_setup_id,
//       });
//       if (!leaveSetup) throw new NotFoundException("Leave Setup not found");
//       emp.leaveSetup = leaveSetup;
//     }

//    if (dto.bankDetails) {
//   for (const bd of dto.bankDetails) {
//     if (bd.id) {
//       // existing bank detail update
//       await this.bankDetailRepo.update(bd.id, bd);
//     } else {
//       // new bank detail create
//       const newBank = this.bankDetailRepo.create({ ...bd, employee: emp });
//       await this.bankDetailRepo.save(newBank);
//     }
//   }
// }

// if (dto.allowance_ids) {
//   const allowances = await this.allowanceRepo.findByIds(dto.allowance_ids);
//   if (allowances.length !== dto.allowance_ids.length) throw new NotFoundException("Some allowances not found");
//   emp.allowances = allowances;
// }



//     Object.assign(emp, dto);


//     if (!dto.is_system_user) {
//       // Agar system user nahi hai, email/password hata do
//       emp.email = null;
//       emp.password = null;
//     }

//     const saved = await this.employeeRepository.save(emp);

//      if (files && Object.keys(files).length > 0) {
//     await this.documentService.createMany(saved.id, files);
//   }

//     //Dobara fetch kar ke sirf names return karenge
//     const fullEmp = await this.employeeRepository.findOne({
//       where: { id: saved.id },
//       relations: ["department", "designation", "shift"],
//     });

//     if (!fullEmp) throw new NotFoundException("Employee not found after save");

//     return {
//       ...saved,
//       department: fullEmp.department.name,
//       designation: fullEmp.designation.name,
//       shift: fullEmp.shift.name,
//     };
//   }

//   async remove(id: number) {
//     const emp = await this.employeeRepository.findOneBy({ id });
//     if (!emp) throw new NotFoundException(`Employee ID ${id} not found`);
//     await this.employeeRepository.remove(emp);
//     return { message: `Employee ID ${id} deleted successfully` };
//   }
// }

import { Injectable, NotFoundException } from "@nestjs/common";
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
import { LeaveSetup } from "../hrm_leave-setup/leave-setup.entity";
import { Allowance } from "../hrm_allowance/allowance.entity";

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
    @InjectRepository(LeaveSetup) private leaveSetupRepo: Repository<LeaveSetup>,
    @InjectRepository(BankDetail) private readonly bankDetailRepo: Repository<BankDetail>,
    @InjectRepository(Allowance) private readonly allowanceRepo: Repository<Allowance>
  ) {}

  private async generateEmployeeCode(): Promise<string> {
    const lastEmployee = await this.employeeRepository.find({
      order: { id: "DESC" },
      take: 1,
    });
    const newId = lastEmployee.length > 0 ? lastEmployee[0].id + 1 : 1;
    return `EMP-${String(newId).padStart(3, "0")}`;
  }

  async findAll() {
    const employees = await this.employeeRepository.find({
      relations: ["department", "designation", "documents", "bankDetails", "leaveSetup","allowances",],
    });

    return employees.map((emp) => ({
       department: emp.department?.name || null,
      designation: emp.designation?.name || null,
      documents: emp.documents || [],
      bankDetails: emp.bankDetails || [],
      leaveSetup: emp.leaveSetup || [],
       allowances: emp.allowances?.map(a => ({
    id: a.id,
    title: a.title,
    type: a.type,
    amount: a.amount,
    company_id: a.company_id,
  })) || [],
    }));
  }

async findOne(id: number) {
  const emp = await this.employeeRepository.findOne({
    where: { id },
    relations: ["department", "designation", "shift", "leaveSetup", "allowances", "documents", "bankDetails"],
  });

  if (!emp) throw new NotFoundException(`Employee ID ${id} not found`);

  const data: any = {
    id: emp.id,
    name: emp.name,
    phone: emp.phone,
    gender: emp.gender,
    email: emp.email,
    password: emp.password,
    is_system_user: emp.is_system_user,
    address: emp.address,
    dateOfBirth: emp.dateOfBirth,
    department: emp.department?.name || null,
    designation: emp.designation?.name || null,
    dateOfJoining: emp.dateOfJoining,
    employeeCode: emp.employeeCode,
    hoursPerDay: emp.hoursPerDay,
    daysPerWeek: emp.daysPerWeek,
    fixedSalary: emp.fixedSalary,
    shift: emp.shift?.name || null,
    leaveSetup: emp.leaveSetup || null,
  };

  // Include dynamic fields BEFORE status
  if (emp.documents?.length > 0) {
    data.documents = emp.documents;
  }

  if (emp.bankDetails?.length > 0) {
    data.bankDetails = emp.bankDetails;
  }

  if (emp.allowances?.length > 0) {
    data.allowances = emp.allowances.map(a => ({
      id: a.id,
      title: a.title,
      type: a.type,
      amount: a.amount,
      company_id: a.company_id,
    }));
  }

  // Status and timestamps at the end
  data.status = emp.status;
  data.created_at = emp.created_at;
  data.updated_at = emp.updated_at;

  return data;
}



  async create(dto: CreateEmployeeDto, files?: { cv?: Express.Multer.File[], photo?: Express.Multer.File[] }) {
    const department = await this.departmentRepository.findOneBy({ id: dto.departmentId });
    const designation = await this.designationRepository.findOneBy({ id: dto.designationId });
    const shift = await this.shiftRepository.findOneBy({ id: dto.shiftId });
    const leaveSetup = await this.leaveSetupRepo.findOneBy({ id: dto.leave_setup_id });

    if (!department) throw new NotFoundException("Department not found");
    if (!designation) throw new NotFoundException("Designation not found");
    if (!shift) throw new NotFoundException("Shift not found");
    if (!leaveSetup) throw new NotFoundException("Leave Setup not found");

    // Fetch allowances if provided
    // let allowances: Allowance[] = [];
    // if (dto.allowance_ids?.length) {
    //   allowances = await this.allowanceRepo.find({ where: { id: In(dto.allowance_ids) } });
    //   if (allowances.length !== dto.allowance_ids.length) throw new NotFoundException("Some allowances not found");
    // }

    const emp = this.employeeRepository.create({
      ...dto,
      department,
      designation,
      shift,
      leaveSetup,
      // allowances,
    });

    emp.is_system_user = dto.is_system_user ?? true;
    if (!dto.is_system_user) {
      emp.email = null;
      emp.password = null;
    }

    emp.employeeCode = await this.generateEmployeeCode();

    const saved = await this.employeeRepository.save(emp);
   // 2. Handle allowance_ids if provided
  // if (dto.allowance_ids?.length) {
  //   const allowances = await this.allowanceRepo.find({ where: { id: In(dto.allowance_ids) } });
  //   if (allowances.length !== dto.allowance_ids.length) {
  //     throw new NotFoundException("Some allowances not found");
  //   }
  //   saved.allowances = allowances; // assign actual objects
  //   await this.employeeRepository.save(saved); // update relation
  // }

  // // 3. Fetch full employee with allowances
  // const fullEmp = await this.employeeRepository.findOne({
  //   where: { id: saved.id },
  //   relations: ["allowances"],
  // });
   // 3️⃣ Handle allowances
  if (dto.allowance_ids?.length) {
    const allowances = await this.allowanceRepo.find({ where: { id: In(dto.allowance_ids) } });
    if (allowances.length !== dto.allowance_ids.length) {
      throw new NotFoundException("Some allowances not found");
    }
    saved.allowances = allowances;
    await this.employeeRepository.save(saved);
  }

    if (files && Object.keys(files).length > 0) {
      await this.documentService.createMany(saved.id, files);
    }

    if (dto.bankDetails?.length) {
      await this.bankDetailService.createMany(saved.id, dto.bankDetails);
    }

    return {
     id: saved.id,
  name: saved.name,
  phone: saved.phone,
  gender: saved.gender,
  email: saved.email,
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
  leaveSetup: saved.leaveSetup,
  allowances: saved.allowances?.map(a => ({
    id: a.id,
    title: a.title,
    type: a.type,
    amount: a.amount,
    company_id: a.company_id,
  })) || [],
  status: saved.status,
  created_at: saved.created_at,
  updated_at: saved.updated_at,
    
    };
  }

  async update(id: number, dto: UpdateEmployeeDto, files?: { cv?: Express.Multer.File[], photo?: Express.Multer.File[] }) {
    const emp = await this.employeeRepository.findOne({
      where: { id },
      relations: ["department", "designation", "shift", "bankDetails"],
    });
    if (!emp) throw new NotFoundException(`Employee ID ${id} not found`);

    // Update relations
    if (dto.departmentId) {
      const department = await this.departmentRepository.findOneBy({ id: dto.departmentId });
      if (!department) throw new NotFoundException("Department not found");
      emp.department = department;
    }

    if (dto.designationId) {
      const designation = await this.designationRepository.findOneBy({ id: dto.designationId });
      if (!designation) throw new NotFoundException("Designation not found");
      emp.designation = designation;
    }

    if (dto.shiftId) {
      const shift = await this.shiftRepository.findOneBy({ id: dto.shiftId });
      if (!shift) throw new NotFoundException("Shift not found");
      emp.shift = shift;
    }

    if (dto.leave_setup_id) {
      const leaveSetup = await this.leaveSetupRepo.findOneBy({ id: dto.leave_setup_id });
      if (!leaveSetup) throw new NotFoundException("Leave Setup not found");
      emp.leaveSetup = leaveSetup;
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
    const allowances = await this.allowanceRepo.find({ where: { id: In(dto.allowance_ids) } });
    if (allowances.length !== dto.allowance_ids.length) throw new NotFoundException("Some allowances not found");
    emp.allowances = allowances;
}

    // if (dto.allowance_ids?.length) {
    //   const allowances = await this.allowanceRepo.find({ where: { id: In(dto.allowance_ids) } });
    //   if (allowances.length !== dto.allowance_ids.length) throw new NotFoundException("Some allowances not found");
    //   emp.allowances = allowances;
    // }

    Object.assign(emp, dto);

   if (dto.is_system_user !== undefined) {
  emp.is_system_user = dto.is_system_user;
  if (!dto.is_system_user) {
    emp.email = null;
    emp.password = null;
  }
}


    const saved = await this.employeeRepository.save(emp);

    if (files && Object.keys(files).length > 0) {
      await this.documentService.createMany(saved.id, files);
    }

    const fullEmp = await this.employeeRepository.findOne({
      where: { id: saved.id },
      relations: ["department", "designation", "shift" ,"leaveSetup", "allowances", ],
    });

    if (!fullEmp) throw new NotFoundException("Employee not found after save");

       return {
     id: saved.id,
  name: saved.name,
  phone: saved.phone,
  gender: saved.gender,
  email: saved.email,
  password: saved.password,
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
  leaveSetup: saved.leaveSetup,
  allowances: saved.allowances?.map(a => ({
    id: a.id,
    title: a.title,
    type: a.type,
    amount: a.amount,
    company_id: a.company_id,
  })) || [],
  status: saved.status,
  created_at: saved.created_at,
  updated_at: saved.updated_at,
    
    };
  }

  async remove(id: number) {
    const emp = await this.employeeRepository.findOneBy({ id });
    if (!emp) throw new NotFoundException(`Employee ID ${id} not found`);
    await this.employeeRepository.remove(emp);
    return { message: `Employee ID ${id} deleted successfully` };
  }
}

