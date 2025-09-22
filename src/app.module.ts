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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'bidec_ERP',
      autoLoadEntities: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      dropSchema: true,
    }),
    TypeOrmModule.forFeature([User]),

    AuthModule, PermissionsModule, RolesModule, UsersModule
  ],
  controllers: [AppController],
  providers: [AppService, registerUser],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly registration: registerUser) { }
  async onModuleInit() {
    await this.registration.run()
  }
}