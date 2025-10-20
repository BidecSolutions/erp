import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from 'src/app.controller';
import { AppService } from './app.service';
import { registerUser } from './seeder/user-seeder.service';
import { User } from './entities/user.entity';
import { userRoles } from './seeder/system-roles.entity';
import { Role } from './entities/role.entity';
import { userRoleMapping } from './entities/user-role-mapping.entity';
import { sideMenus } from './entities/side-menu.entity';
import { subSideMenus } from './entities/sub-side-menu.entity';
import { sidemunuRolesMapping } from './entities/role-side-menu-mapping.entity';
import { companySetting } from './Company/company-module-file.module';
import { procurement } from './procurement/procurement-module-list.module';
import { HRM } from './hrm/hrm-module-list.entity';
import { sideMenuAndRoleSeederService } from './seeder/side-menu-and-role-seeder.service';
import { subSideMenuPermission } from './entities/sub-side-menu-permission.entity';
import { sales } from './sales/sales-module-list.module';
import { POS } from './pos/POS-module-file.module';
import { FiscalModule } from './accounts/fiscal/fiscal.module';
import { accounts } from './accounts/accounts-module-list.module';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'bidec_erp1',
      autoLoadEntities: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      dropSchema: false,
      migrationsRun: false,

    }),
    TypeOrmModule.forFeature([subSideMenuPermission, User, Role, userRoleMapping, sideMenus, subSideMenus, sidemunuRolesMapping]),
    ...procurement,
    ...companySetting,
    ...HRM,
    ...sales,
    ...POS,
<<<<<<< HEAD
    ...accounts,
=======





>>>>>>> 89ec5ccbf0a7f9d2d75a1913ce1499dd20e0c67d
  ],
  controllers: [AppController],
  providers: [AppService, registerUser, userRoles, sideMenuAndRoleSeederService,],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly registration: registerUser,
    private readonly userRole: userRoles,
    private readonly menus: sideMenuAndRoleSeederService

  ) { }
  async onModuleInit() {
    // await this.registration.run()
    // await this.userRole.run()
    // await this.menus.run()
  }
}