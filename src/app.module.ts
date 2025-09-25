import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from 'src/app.controller';
import { AppService } from './app.service';
import { registerUser } from './seeder/user-seeder.service';
import { User } from './entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { userRoles } from './seeder/system-roles.entity';
import { Role } from './entities/role.entity';
import { userRoleMapping } from './entities/user-role-mapping.entity';
import { sideMenus } from './entities/side-menu.entity';
import { subSideMenus } from './entities/sub-side-menu.entity';
import { sidemunuRolesMapping } from './entities/role-side-menu-mapping.entity';
import { LeaveSetupModule } from './hrm/hrm_leave-setup/leave-setup.module';
import { ProductModule } from './procurement/product/product.module';
import { PurchaseRequestModule } from './procurement/purchase_request/purchase_request.module';
import { PurchaseRequestItemsModule } from './procurement/purchase_request_items/purchase_request_items.module';
import { PurchaseOrderModule } from './procurement/purchase_order/purchase_order.module';
import { CategoriesModule } from './procurement/categories/categories.module';
import { BrandModule } from './procurement/brand/brand.module';
import { UnitOfMeasureModule } from './procurement/unit_of_measure/unit_of_measure.module';
import { CompaniesModule } from './Company/companies/companies.module';
import { BranchModule } from './Company/branch/branch.module';
import { CustomerModule } from './Company/customers/customer.module';
import { CustomerCategoryModule } from './Company/customer-categories/customer-category.module';
import { DepartmentModule } from './hrm/hrm_department/department.module';
import { DesignationModule } from './hrm/hrm_designation/designation.module';
import { EmployeeModule } from './hrm/hrm_employee/employee.module';
import { PaysliptypeModule } from './hrm/hrm_paysliptype/paysliptype.module';
import { EmployeeSalaryModule } from './hrm/hrm_employee-salary/employee-salary.module';
import { AllowanceModule } from './hrm/hrm_allowance/allowance.module';
import { LoanOptionModule } from './hrm/hrm_loan-option/loan-option.module';
import { LoanModule } from './hrm/hrm_loan/loan.module';
import { AttendanceModule } from './hrm/hrm_mark-attendance/mark-attendance.module';
import { BulkAttendanceModule } from './hrm/hrm_bulk-attendance/bulk-attendance.module';
import { BankDetailModule } from './hrm/hrm_bank-details/bank-details.module';
import { ShiftModule } from './hrm/hrm_shift/shift.module';
import { DocumentModule } from './hrm/hrm_document/document.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'bidec_erp',
      autoLoadEntities: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Role, userRoleMapping, sideMenus, subSideMenus, sidemunuRolesMapping]),

    AuthModule, PermissionsModule, RolesModule, UsersModule, ProductModule,
    PurchaseRequestModule,
    PurchaseRequestItemsModule,
    PurchaseOrderModule,
    CategoriesModule,
    BrandModule,
    UnitOfMeasureModule,
    CompaniesModule,
    BranchModule,
    CustomerCategoryModule,
    CustomerModule,
    // HRM 
    DepartmentModule,
    DesignationModule,
    EmployeeModule,
    PaysliptypeModule,
    EmployeeSalaryModule,
    AllowanceModule,
    LoanOptionModule,
    LoanModule,
    AttendanceModule,
    BulkAttendanceModule,
    BankDetailModule,
    ShiftModule,
    DocumentModule,
    LeaveSetupModule
  ],
  controllers: [AppController],
  providers: [AppService, registerUser, userRoles],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly registration: registerUser,
    private readonly userRole: userRoles

  ) { }
  async onModuleInit() {
    await this.registration.run()
    await this.userRole.run()
  }
}