import { AllowanceModule } from "./hrm_allowance/allowance.module";
import { AnnualLeaveModule } from "./hrm_annual-leave/annual-leave.module";
import { BankDetailModule } from "./hrm_bank-details/bank-details.module";
import { BulkAttendanceModule } from "./hrm_bulk-attendance/bulk-attendance.module";
import { DepartmentModule } from "./hrm_department/department.module";
import { DesignationModule } from "./hrm_designation/designation.module";
import { DocumentModule } from "./hrm_document/document.module";
import { EmployeeSalaryModule } from "./hrm_employee-salary/employee-salary.module";
import { EmployeeModule } from "./hrm_employee/employee.module";
import { LeaveRequestModule } from "./hrm_leave-request/leave-request.module";
import { LeaveTypeModule } from "./hrm_leave-type/leave-type.module";
import { LoanOptionModule } from "./hrm_loan-option/loan-option.module";
import { LoanModule } from "./hrm_loan/loan.module";
import { AttendanceModule } from "./hrm_mark-attendance/mark-attendance.module";
import { NotificationTypeModule } from "./hrm_notification-type/notification-type.module";
import { NotificationModule } from "./hrm_notification/notification.module";
import { PaysliptypeModule } from "./hrm_paysliptype/paysliptype.module";
import { ShiftModule } from "./hrm_shift/shift.module";
import { UnpaidLeaveModule } from "./hrm_unpaid-leave/unpaid-leave.module";

export const HRM = [
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
    AnnualLeaveModule,
    LeaveTypeModule,
    NotificationModule,
    LeaveRequestModule,
    UnpaidLeaveModule,
    NotificationTypeModule,
    LeaveRequestModule,
]