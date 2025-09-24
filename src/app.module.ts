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

    AuthModule, PermissionsModule, RolesModule, UsersModule, LeaveSetupModule
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