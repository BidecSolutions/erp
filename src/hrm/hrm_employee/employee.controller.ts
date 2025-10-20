import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Query,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtBranchAuth } from 'src/auth/jwt-branch.guard';
import { DepartmentService } from '../hrm_department/department.service';
import { JwtEmployeeAuth } from 'src/auth/jwt-employee.guard';
import { DesignationService } from '../hrm_designation/designation.service';
import { AuthService } from 'src/auth/auth.service';
import { BranchService } from 'src/Company/branch/branch.service';
import { AllowanceService } from '../hrm_allowance/allowance.service';
import { LeaveTypeService } from '../hrm_leave-type/leave-type.service';
import { ShiftService } from '../hrm_shift/shift.service';
import { AnnualLeaveService } from '../hrm_annual-leave/annual-leave.service';
import { ProbationSettingService } from '../hrm_probation-setting/probation-setting.service';

@UseGuards(JwtEmployeeAuth)
@Controller('employee')
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly departmentService: DepartmentService,
    private readonly designationService: DesignationService,
    private readonly authService: AuthService,
    private readonly branchService: BranchService,
    private readonly allowanceService: AllowanceService,
    private readonly leaveTypeService: LeaveTypeService,
    private readonly shiftService: ShiftService,
    private readonly annualLeaveService: AnnualLeaveService,
    private readonly probationService: ProbationSettingService
  ) { }

  @Post('get-employees-dependent')
  async getEmployeesDependent(@Req() req: Request) {
    const company_id = req['user'].company_id;
    const departments = await this.departmentService.findAll(company_id);
    const designation = await this.designationService.findAll(company_id);
    const roles = await this.authService.getAllRoles(company_id);
    const branches = await this.branchService.findCompanyBranch(company_id);
    const allowances = await this.allowanceService.findAll(company_id);
    const leave_type = await this.leaveTypeService.findAll(company_id);
    const shift = await this.shiftService.findAll(company_id);
    const annualLeave = await this.annualLeaveService.findAll(company_id);
    const probationSetting = await this.probationService.findAll(company_id);

    return { departments, designation, roles, branches, allowances, leave_type, shift, annualLeave, probationSetting }
  }



  @Post('create')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'cv', maxCount: 1 },
        { name: 'photo', maxCount: 1 },
        { name: 'academic_transcript', maxCount: 1 },
        { name: 'identity_card', maxCount: 2 }, // 👈 2 files allow
      ],
      {
        storage: diskStorage({
          destination: './uploads/employees',
          filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            callback(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
          },
        }),
        fileFilter: (req, file, callback) => {
          const allowedTypes = {
            cv: [
              'application/pdf',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ],
            academic_transcript: [
              'application/pdf',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ],
            photo: ['image/png', 'image/jpg', 'image/jpeg'],
            identity_card: ['image/png', 'image/jpg', 'image/jpeg'],
          };

          const fieldRules = allowedTypes[file.fieldname];
          if (fieldRules && !fieldRules.includes(file.mimetype)) {
            let message = '';
            switch (file.fieldname) {
              case 'cv':
                message = 'CV must be a PDF or DOCX file';
                break;
              case 'academic_transcript':
                message = 'Academic Transcript must be a PDF or DOCX file';
                break;
              case 'photo':
                message = 'Photo must be in PNG, JPG, or JPEG format';
                break;
              case 'identity_card':
                message = 'Identity Card must be in PNG, JPG, or JPEG format';
                break;
              default:
                message = `${file.fieldname} has an invalid file type`;
            }
            return callback(new BadRequestException(message), false);
          }

          // // Photo size check (2MB limit)
          if (file.fieldname === 'photo' && file.size > 2 * 1024 * 1024) {
            return callback(new BadRequestException('Photo must not exceed 2 MB'), false);
          }

          callback(null, true);
        },
      },
    ),
  )
  create(
    @Body() dto: CreateEmployeeDto, @Req() req: Request,
    @UploadedFiles()
    files: {
      cv?: Express.Multer.File[];
      photo?: Express.Multer.File[];
      academic_transcript?: Express.Multer.File[];
      identity_card?: Express.Multer.File[];
    },
  ) {
    const login_company_id = req["user"].company_id;
    const userId = req["user"].user?.id;
    return this.employeeService.create(dto, files, login_company_id,userId);
  }

  // @Get('list')
  // findAll() {
  //   return this.employeeService.findAll();
  // }
  @Post('list')
  findAll(@Body() body: any, @Req() req: Request) {
    const company_id = req["user"].company_id;
    return this.employeeService.findAll(body, company_id);
  }

  @Get(':id/get')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeeService.findOne(id);
  }

  @Put(':id/update')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'cv', maxCount: 1 },
        { name: 'photo', maxCount: 1 },
        { name: 'academic_transcript', maxCount: 1 },
        { name: 'identity_card', maxCount: 2 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/employees',
          filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            callback(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
          },
        }),
      },
    ),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
     @Req() req: Request,
    @Body() dto: UpdateEmployeeDto,
    @UploadedFiles() files: { cv?: Express.Multer.File[]; photo?: Express.Multer.File[] },
  ) {
        const userId = req["user"].user?.id;
    return this.employeeService.update(id, dto,userId, files);
  }

  // @Delete(':id/delete')
  // remove(@Param('id', ParseIntPipe) id: number) {
  //   return this.employeeService.remove(id);
  // }

  @Get('toogleStatus/:id')
  statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.employeeService.statusUpdate(id);
  }
}
