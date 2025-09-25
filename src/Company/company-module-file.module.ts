import { AuthModule } from "src/auth/auth.module";
import { BranchModule } from "./branch/branch.module";
import { CompaniesModule } from "./companies/companies.module";
import { CustomerCategoryModule } from "./customer-categories/customer-category.module";
import { CustomerModule } from "./customers/customer.module";
import { PermissionsModule } from "src/permissions/permissions.module";
import { RolesModule } from "src/roles/roles.module";
import { UsersModule } from "src/users/users.module";
import { SupplierCategoryModule } from "./supplier-category/supplier-category.module";
import { SupplierModule } from "./supplier/supplier.module";

export const companySetting = [
    CompaniesModule,
    BranchModule,
    CustomerCategoryModule,
    CustomerModule,
    SupplierCategoryModule,
    SupplierModule,
    AuthModule,
    PermissionsModule,
    RolesModule,
    UsersModule,
];