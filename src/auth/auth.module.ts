import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // 👈 Import this
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { jwtConstants } from './constants';
import { UserToken } from './save-token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { MailService } from './mail.service';
import { userRoleMapping } from 'src/entities/user-role-mapping.entity';
import { sideMenus } from 'src/entities/side-menu.entity';
import { subSideMenus } from 'src/entities/sub-side-menu.entity';
import { sidemunuRolesMapping } from 'src/entities/role-side-menu-mapping.entity';
import { Permission } from 'src/entities/Permission.entity';
import { Role } from 'src/entities/role.entity';
import { subSideMenuPermission } from 'src/entities/sub-side-menu-permission.entity';
import { userCompanyMapping } from 'src/entities/user-company-mapping.entity';
import { Branch } from 'src/Company/branch/branch.entity';
import { BranchStrategy } from './branch.strategy';
import { JwtBranchAuth } from './jwt-branch.guard';
@Module({
  imports: [
    TypeOrmModule.forFeature([Branch, userCompanyMapping, subSideMenuPermission, Role, Permission, UserToken, User, userRoleMapping, sideMenus, subSideMenus, sidemunuRolesMapping]),
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, MailService, BranchStrategy, JwtBranchAuth],
  controllers: [AuthController],
})
export class AuthModule { }
