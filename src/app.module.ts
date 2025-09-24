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
import { SalesOrder } from './sales/sales-order/entity/sales-order.entity';

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
    SalesOrder,
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